# 点云上采样

<!-- [tag]: Paper、3D Reconstruction、Upsampling -->

<!-- [description]: 点云上采样 -->

## RepKPU: point cloud upsampling with kernel point representation and deformation

### 动机

目前点云上采样有两种做法：generation-based/refinement-based。生成：提特征 -> 回归xyz，坐标会出现异常值，**回归难度大**。细化/微调：粗生成：简单插值 -> 提特征 -> 从特征生成点然后基于**距离函数**微调点坐标。

#### 距离函数

SDF 和 UDF 都是常见的距离函数，用以表示点到表面的距离，常用于重建/表面补全等等的任务。

SDF 是有符号距离函数，用以表示点在物体表面内部还是外部，距离表面多远。UDF 为有符号距离函数，用以表示点距离表面的距离。SDF 一般使用在封闭表面场景，如球面，飞机等等这类数据。UDF 携带信息更少，但是更易计算更方便使用，且对开放表面和非水密（watertight）点云更友好。

有的点云上采样方法会通过上述距离场来修正生成的点，但**从稀疏的点云里去学习这个距离场较为困难**。

### 方法

这篇工作提出了一种Kernel-to-Displacement的方法，优化形状表示和点云生成策略。
采用类似KPConv的方法。

#### KPConv

1. 对于一个中心点，用类似knn或者ball query来找邻域点
2. 然后在中心点附近放一组kernel points（类似2d图像里的卷积核，这里起到的是3d空间上的卷积核的作用）
3. 然后找到距离每个kernel point距离近的点，通过距离加权算贡献，得到在这个kernel point上产生的特征
4. 最后再聚合得到这个中心点的特征

这个工作参照KPConv设计了一个**RepKPoints**（kernel point representation）：
每个输入点，在以它为球心半径为r_k的球面上均匀采一组kernel points，然后用输入点邻域的点特征去预测每个kernel point的offset，把这个offset叠加上去得到这个输入点的RepKPoints，用来表示局部形状。
以及**KP Queries**(kernel point queries)

#### 网络Pipeline

1. 输入是 $N*3$ 的点云，逐点encoder出C_e长度的特征 $N*C_e$。
2. 每个输入点先**提取M个RepKPoints**：
    1. 每个输入点通过ball query找到n个邻域点，拿到 $n*3$ 的点坐标和 $n*C_e$ 的特征
    2. $n*C_e$ 做共享权重MLP得到 $n*C_k$
    3. init M个kernel Point（工作中设置为15），每个kernel Point跟n个邻域点坐标计算距离d，距离用来加权，加权函数 $max(0, 1 - d / σ)$
    4. 用这个权重去做特征的聚合，每个kernel point将 $n*C_k$ 加权相加得到它对应的长度为C_k的特征向量，M个kernel point即 $M*C_k$
    5. 对每个kernel point的特征再做一个维度变换，即 $M*C_k$ 经过一个权重矩阵 $W_Δ: M × C_k × C_out$ 后得到 $M*C_out$
    6. $M*C_out$ 相加得到长度为 $C_out$ 的 $f_Δ$
    7. 再用 $f_Δ$ 经过MLP之后得到 $M*3$ 的 $Δ_k$，这个是每个kernel point的3d offset，叠加在 init的kernel point坐标上得到RepKPoints的空间坐标。
3. 得到RepKPoints后，用新坐标跟邻域点做特征加权聚合，得到一份新的 $F_p: M*C_k$，然后乘一个可学习矩阵 $M*C_k*C_k$ 然后把特征聚合（求和），得到一个 $C_k$ 长度的特征向量，作为这个点这个局部的特征 $f_g$，concat到 $F_p: M*C_k$ 上得到 $M*2C_k$，再过一个MLP得到最终的RepKPoints特征 $F_k: M*C_k$
![alt text](assets/image-1.png)
4. 第3步得到了两个特征：一个是每个输入点的局部邻域特征 $f_g$ （N个输入点， $F_g=N*C_k$ ），一个是每个输入点对应的RepKPoints的特征 $F_k$，接下来**准备建立KP Queries**，每个输入点r个query，r是上采样倍率：
    1. 初始化是在球面上均匀采r个点
    2. 依旧先ball query找邻域，然后距离加权更新KP Query的特征，得到 $F_{p'} = r * C_k$
    3. 跟上一步的矩阵乘并聚合很像，就是乘一个新的权重矩阵然后出一个 $f_{g'} = 1 * C_k$ 的特征向量，$f_g$ 和 $f_{g'}$ 两个拼上刚刚的 $F_{p'}$ 得到 $r*3C_k$ 的特征然后过一个MLP得到KP Queries的特征向量 $F_q$

![alt text](assets/image-3.png)
5. 现在获得了RepKPoints的特征矩阵 $N*M*C_k$，以及KP Queries的特征矩阵 $N*r*C_k$，接着做**cross attention**，用KP Queries的特征做查询，RepKPoints的特征做key和value。这里会做一次维度变换计算，但是计算前后维度不变，C_k = C_d = 128，经过三层[cross attention + MLP]最终得到displacement 的特征矩阵 F_d
6. 最后经过一个MLP将 $N*r*C_k$ 变换为 $N*r$ 个坐标
![alt text](assets/image-2.png)

#### 监督信号

这份工作的监督信号主要分为三个部分：
$$L = L_{cd} + L_{fit} + L_{rep}$$
L_cd是双向chamfer distance，直接用gt点云和预测坐标计算
后两项主要用来约束KPConv环节中的3d offset的预测，这两项不需要直接的GT，作用是：L_rep防止点聚在一块，L_fit：使预测的RepKPoints靠近某个局部邻域点。

### 实验评估

PU-GAN dataset，点云上采样里很常见的 benchmark
这篇工作最后指标用了3个：

1. CD：Chamfer Distance
2. HD：Hausdorff Distance（最大的最近邻距离，最坏的离群点）
3. P2F：Point-to-Surface Distance（在我们这个任务里可能可以改成到边缘曲线的距离？）

如果做边缘上的上采样的话，可能需要增加额外的指标来对比效果，还要考虑GT的范围
