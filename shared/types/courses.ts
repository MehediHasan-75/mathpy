export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  created_at: string;
}

export interface CourseCreate {
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  is_published?: boolean;
}

export interface CourseUpdate {
  title?: string;
  description?: string | null;
  thumbnail_url?: string | null;
  is_published?: boolean;
}

export interface Chapter {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
}

export interface ChapterCreate {
  course_id: string;
  title: string;
  order_index: number;
}

export interface ChapterUpdate {
  title?: string;
  order_index?: number;
}

export interface Lesson {
  id: string;
  chapter_id: string;
  title: string;
  order_index: number;
  youtube_video_id: string | null;
  notes_content: string | null;
  notes_file_url: string | null;
  live_class_url: string | null;
  live_at: string | null;
  is_free: boolean;
  created_at: string;
}

export interface LessonCreate {
  chapter_id: string;
  title: string;
  order_index: number;
  youtube_video_id?: string | null;
  notes_content?: string | null;
  notes_file_url?: string | null;
  live_class_url?: string | null;
  live_at?: string | null;
  is_free?: boolean;
}

export interface LessonUpdate {
  title?: string;
  order_index?: number;
  youtube_video_id?: string | null;
  notes_content?: string | null;
  notes_file_url?: string | null;
  live_class_url?: string | null;
  live_at?: string | null;
  is_free?: boolean;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

export interface StudyMaterial {
  id: string;
  course_id: string;
  chapter_id: string | null;
  title: string;
  file_url: string;
  created_at: string;
}

export interface StudyMaterialCreate {
  course_id: string;
  chapter_id?: string | null;
  title: string;
  file_url: string;
}
