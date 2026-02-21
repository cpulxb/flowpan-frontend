// Mock data for FlowPan demo

export interface FileItem {
  id: string
  name: string
  type: "folder" | "video" | "music" | "image" | "doc" | "other"
  size: number | null
  modifiedAt: string
  parentId: string | null
  status?: "transcoding" | "ready"
}

export interface ShareItem {
  id: string
  fileId: string
  fileName: string
  fileType: FileItem["type"]
  validity: "1天" | "7天" | "30天" | "永久"
  sharedAt: string
  shareCode: string
  shareLink: string
  expiresAt: string
}

export interface RecycleItem {
  id: string
  name: string
  type: FileItem["type"]
  size: number | null
  deletedAt: string
}

export interface UserItem {
  id: string
  nickname: string
  email: string
  status: "active" | "disabled"
  totalSpace: number
  usedSpace: number
  avatar?: string
}

export const mockFiles: FileItem[] = [
  { id: "1", name: "项目文档", type: "folder", size: null, modifiedAt: "2026-02-20", parentId: null },
  { id: "2", name: "需求文档.pdf", type: "doc", size: 2.3 * 1024 * 1024, modifiedAt: "2026-02-19", parentId: null },
  { id: "3", name: "演示视频.mp4", type: "video", size: 156 * 1024 * 1024, modifiedAt: "2026-02-18", parentId: null, status: "transcoding" },
  { id: "4", name: "设计图.png", type: "image", size: 1.2 * 1024 * 1024, modifiedAt: "2026-02-17", parentId: null },
  { id: "5", name: "背景音乐.mp3", type: "music", size: 4.5 * 1024 * 1024, modifiedAt: "2026-02-16", parentId: null },
  { id: "6", name: "源码.zip", type: "other", size: 20 * 1024 * 1024, modifiedAt: "2026-02-15", parentId: null },
  { id: "7", name: "产品规划.docx", type: "doc", size: 856 * 1024, modifiedAt: "2026-02-14", parentId: null },
  { id: "8", name: "宣传图片", type: "folder", size: null, modifiedAt: "2026-02-13", parentId: null },
  { id: "9", name: "会议录音.mp3", type: "music", size: 12.8 * 1024 * 1024, modifiedAt: "2026-02-12", parentId: null },
  { id: "10", name: "架构图.png", type: "image", size: 3.4 * 1024 * 1024, modifiedAt: "2026-02-11", parentId: null },
  { id: "11", name: "数据备份.sql", type: "other", size: 45 * 1024 * 1024, modifiedAt: "2026-02-10", parentId: null },
  { id: "12", name: "用户手册.pdf", type: "doc", size: 5.6 * 1024 * 1024, modifiedAt: "2026-02-09", parentId: null },
  { id: "s1", name: "前端项目", type: "folder", size: null, modifiedAt: "2026-02-18", parentId: "1" },
  { id: "s2", name: "后端项目", type: "folder", size: null, modifiedAt: "2026-02-17", parentId: "1" },
  { id: "s3", name: "设计稿", type: "folder", size: null, modifiedAt: "2026-02-16", parentId: "1" },
  { id: "13", name: "团队合影.jpg", type: "image", size: 8.7 * 1024 * 1024, modifiedAt: "2026-02-08", parentId: null },
  { id: "14", name: "产品演示.mp4", type: "video", size: 320 * 1024 * 1024, modifiedAt: "2026-02-07", parentId: null },
  { id: "15", name: "季度报告.xlsx", type: "doc", size: 1.1 * 1024 * 1024, modifiedAt: "2026-02-06", parentId: null },
  { id: "16", name: "培训资料", type: "folder", size: null, modifiedAt: "2026-02-05", parentId: null },
  { id: "17", name: "品牌素材.psd", type: "image", size: 45 * 1024 * 1024, modifiedAt: "2026-02-04", parentId: null },
  { id: "18", name: "播客录音.mp3", type: "music", size: 28 * 1024 * 1024, modifiedAt: "2026-02-03", parentId: null },
  { id: "19", name: "API文档.md", type: "doc", size: 256 * 1024, modifiedAt: "2026-02-02", parentId: null },
  { id: "20", name: "发布包-v2.1.tar.gz", type: "other", size: 89 * 1024 * 1024, modifiedAt: "2026-02-01", parentId: null },
]

export const mockShares: ShareItem[] = [
  { id: "sh1", fileId: "2", fileName: "需求文档.pdf", fileType: "doc", validity: "7天", sharedAt: "2026-02-20", shareCode: "ab12c", shareLink: "https://flowpan.com/s/abc123def", expiresAt: "2026-02-27" },
  { id: "sh2", fileId: "1", fileName: "项目源码", fileType: "folder", validity: "永久", sharedAt: "2026-02-18", shareCode: "xz98y", shareLink: "https://flowpan.com/s/xyz789ghi", expiresAt: "永久" },
  { id: "sh3", fileId: "3", fileName: "演示视频.mp4", fileType: "video", validity: "30天", sharedAt: "2026-02-15", shareCode: "mn45o", shareLink: "https://flowpan.com/s/mno456jkl", expiresAt: "2026-03-17" },
]

export const mockRecycle: RecycleItem[] = [
  { id: "r1", name: "旧文档.pdf", type: "doc", size: 2.3 * 1024 * 1024, deletedAt: "2026-02-19" },
  { id: "r2", name: "废弃目录", type: "folder", size: null, deletedAt: "2026-02-18" },
  { id: "r3", name: "截图.png", type: "image", size: 800 * 1024, deletedAt: "2026-02-17" },
  { id: "r4", name: "测试数据.json", type: "other", size: 156 * 1024, deletedAt: "2026-02-16" },
]

export const mockUsers: UserItem[] = [
  { id: "abc123", nickname: "张三", email: "zhangsan@mail.com", status: "active", totalSpace: 10 * 1024 * 1024 * 1024, usedSpace: 5.2 * 1024 * 1024 * 1024 },
  { id: "def456", nickname: "李四", email: "lisi@mail.com", status: "disabled", totalSpace: 5 * 1024 * 1024 * 1024, usedSpace: 1.8 * 1024 * 1024 * 1024 },
  { id: "ghi789", nickname: "王五", email: "wangwu@mail.com", status: "active", totalSpace: 5 * 1024 * 1024 * 1024, usedSpace: 4.2 * 1024 * 1024 * 1024 },
  { id: "jkl012", nickname: "赵六", email: "zhaoliu@mail.com", status: "active", totalSpace: 20 * 1024 * 1024 * 1024, usedSpace: 8.5 * 1024 * 1024 * 1024 },
  { id: "mno345", nickname: "孙七", email: "sunqi@mail.com", status: "active", totalSpace: 5 * 1024 * 1024 * 1024, usedSpace: 0.3 * 1024 * 1024 * 1024 },
]

export function formatFileSize(bytes: number | null): string {
  if (bytes === null) return "--"
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB"
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB"
}

export function getFilesByParent(parentId: string | null): FileItem[] {
  return mockFiles.filter(f => f.parentId === parentId)
}

export function getFileById(id: string): FileItem | undefined {
  return mockFiles.find(f => f.id === id)
}
