import {
  Folder,
  FileVideo,
  Music,
  ImageIcon,
  FileText,
  Package,
  type LucideIcon,
} from "lucide-react"

export type FileCategory = "folder" | "video" | "music" | "image" | "doc" | "other"

interface FileTypeInfo {
  icon: LucideIcon
  color: string
  label: string
}

const fileTypeMap: Record<FileCategory, FileTypeInfo> = {
  folder: { icon: Folder, color: "text-[#f0ad4e]", label: "文件夹" },
  video: { icon: FileVideo, color: "text-[#d03050]", label: "视频" },
  music: { icon: Music, color: "text-[#18a058]", label: "音乐" },
  image: { icon: ImageIcon, color: "text-[#2080f0]", label: "图片" },
  doc: { icon: FileText, color: "text-[#6c5ce7]", label: "文档" },
  other: { icon: Package, color: "text-muted-foreground", label: "其他" },
}

export function getFileTypeInfo(type: FileCategory): FileTypeInfo {
  return fileTypeMap[type] || fileTypeMap.other
}
