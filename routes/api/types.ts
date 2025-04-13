// types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: number;
          title: string;
          language: string;
          github_link: string;
          description: string;
          background_color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          language: string;
          github_link: string;
          description: string;
          background_color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          language?: string;
          github_link?: string;
          description?: string;
          background_color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      publications: {
        Row: {
          id: number;
          title: string;
          abstract: string;
          filename: string;
          link: string;
          link_label: string;
          year: number;
          journal: string;
          background_color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          abstract: string;
          filename: string;
          link: string;
          link_label: string;
          year: number;
          journal: string;
          background_color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          title?: string;
          abstract?: string;
          filename?: string;
          link?: string;
          link_label?: string;
          year?: number;
          journal?: string;
          background_color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      project_technologies: {
        Row: {
          project_id: number;
          technology_id: number;
        };
        Insert: {
          project_id: number;
          technology_id: number;
        };
        Update: {
          project_id?: number;
          technology_id?: number;
        };
      };
      technologies: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
      };
    };
    Views: {
      project_details: {
        Row: {
          id: number;
          title: string;
          github_link: string;
          description: string;
          background_color: string | null;
          technologies: string | null;
        };
      };
      publication_details: {
        Row: {
          id: number;
          title: string;
          abstract: string;
          filename: string;
          link: string;
          link_label: string;
          year: number;
          journal: string;
          background_color: string | null;
        };
      };
    };
    Functions: {};
    Enums: {};
  };
}