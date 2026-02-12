import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 在 ESM 模块中定义 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 更改为 public/notes，这样 Vite 会自动将其打包到输出目录
const NOTE_DIR = path.join(__dirname, '../public/notes');
const OUTPUT_FILE = path.join(__dirname, '../services/registry.ts');

// 确保目录存在
if (!fs.existsSync(NOTE_DIR)) {
  fs.mkdirSync(NOTE_DIR, { recursive: true });
}

function getMetadata() {
  if (!fs.existsSync(NOTE_DIR)) return [];
  
  const files = fs.readdirSync(NOTE_DIR);
  const notes = files.map(file => {
    const filePath = path.join(NOTE_DIR, file);
    const stats = fs.statSync(filePath);
    const ext = path.extname(file).toLowerCase();
    const id = path.parse(file).name;
    
    let title = id.replace(/-/g, ' '); 
    let description = "";
    let type = 'markdown';
    let tags = ["Archive"]; // 默认标签
    
    if (ext === '.md') {
      type = 'markdown';
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // 1. 提取标题 (H1)
      const titleMatch = content.match(/^#\s+(.*)/m);
      if (titleMatch) title = titleMatch[1];
      
      // 2. 提取标签: <!-- [tag]: Web应用、Vite -->
      const tagsMatch = content.match(/<!--\s*\[tag\]:\s*(.*?)\s*-->/i);
      if (tagsMatch) {
        const rawTags = tagsMatch[1]
          .split(/[、,，]\s*/) // 支持中文顿号、中英文逗号
          .map(t => t.trim())
          .filter(Boolean);
        if (rawTags.length > 0) tags = rawTags;
      }
      
      // 3. 提取描述 <!-- [description]: 记录Blog网站搭建所用工具及流程 -->
      const descMatch = content.match(/<!--\s*\[description\]:\s*(.*?)\s*-->/i);
      if (descMatch) {
        description = descMatch[1].trim();
      } else {
        const contentForDesc = content
          .replace(/^#\s+.*/m, '') // 移除标题行
          .replace(/<!--\s*\[tag\]:\s*.*?\s*-->/gi, '') // 移除标签注释
          .trim();
        const descLine = contentForDesc.split('\n').find(line => line.trim().length > 0);
        description = descLine ? descLine.slice(0, 150).replace(/[#*`]/g, '').trim() : "";
      }
    } else if (ext === '.pdf') {
      type = 'pdf';
      title = title.toUpperCase();
    } else {
      return null;
    }

    return {
      id,
      title,
      date: stats.mtime.toISOString().split('T')[0],
      tags,
      description: description || `Technical entry for ${title}`,
      type,
      // 这里的路径相对于部署后的网站根目录
      path: `notes/${file}`
    };
  }).filter(Boolean);

  return notes;
}

const notes = getMetadata();
// 将数据包装在导出常量中，符合 TypeScript 格式
const content = `import { NoteMetadata } from '../types';\n\nexport const registryData: NoteMetadata[] = ${JSON.stringify(notes, null, 2)};`;

fs.writeFileSync(OUTPUT_FILE, content);
console.log(`Successfully generated registry.ts with ${notes.length} notes from public/notes.`);
