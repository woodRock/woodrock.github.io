// supabase.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Database } from "./types.ts";

// Supabase client setup
export const createSupabaseClient = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables. Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set.");
  }
  
  return createClient<Database>(supabaseUrl, supabaseKey);
};

// Project data types
export interface Project {
  id: number;
  title: string;
  language: string;
  github_link: string;
  description: string;
  background_color?: string;
  created_at?: string;
  updated_at?: string;
}

// Publication data types
export interface Publication {
  id: number;
  title: string;
  abstract: string;
  filename: string;
  link: string;
  link_label: string;
  year: number;
  journal: string;
  background_color?: string;
  created_at?: string;
  updated_at?: string;
}

// Projects API
export const projectsApi = {
  async getAll(): Promise<Project[]> {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("title");
      
    if (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
    
    return data || [];
  },
  
  async getById(id: number): Promise<Project | null> {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
    
    return data;
  }
};

// Publications API
export const publicationsApi = {
  async getAll(): Promise<Publication[]> {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("publications")
      .select("*")
      .order("year", { ascending: false })
      .order("title");
      
    if (error) {
      console.error("Error fetching publications:", error);
      throw error;
    }
    
    return data || [];
  },
  
  async getById(id: number): Promise<Publication | null> {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("publications")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      console.error(`Error fetching publication ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  async getByYear(year: number): Promise<Publication[]> {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("publications")
      .select("*")
      .eq("year", year)
      .order("title");
      
    if (error) {
      console.error(`Error fetching publications for year ${year}:`, error);
      throw error;
    }
    
    return data || [];
  }
};