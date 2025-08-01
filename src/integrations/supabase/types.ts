export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action_type: string
          admin_user_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          target_id: string | null
          target_table: string | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_logs_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_notifications: {
        Row: {
          created_at: string | null
          creator_id: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_notifications_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_onboarding_steps: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          creator_id: string
          id: string
          step_name: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          creator_id: string
          id?: string
          step_name: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          creator_id?: string
          id?: string
          step_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_onboarding_steps_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_products: {
        Row: {
          category: string | null
          created_at: string
          creator_id: string
          creator_margin_percentage: number
          description_en: string | null
          description_fr: string | null
          description_ty: string | null
          design_data: Json
          design_file_info: Json | null
          generated_mockups: Json | null
          id: string
          is_published: boolean
          name_en: string | null
          name_fr: string
          name_ty: string | null
          original_design_url: string | null
          preview_url: string | null
          print_product_id: string
          seo_description_en: string | null
          seo_description_fr: string | null
          seo_description_ty: string | null
          seo_title_en: string | null
          seo_title_fr: string | null
          seo_title_ty: string | null
          slug: string | null
          status: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          creator_id: string
          creator_margin_percentage?: number
          description_en?: string | null
          description_fr?: string | null
          description_ty?: string | null
          design_data?: Json
          design_file_info?: Json | null
          generated_mockups?: Json | null
          id?: string
          is_published?: boolean
          name_en?: string | null
          name_fr: string
          name_ty?: string | null
          original_design_url?: string | null
          preview_url?: string | null
          print_product_id: string
          seo_description_en?: string | null
          seo_description_fr?: string | null
          seo_description_ty?: string | null
          seo_title_en?: string | null
          seo_title_fr?: string | null
          seo_title_ty?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          creator_id?: string
          creator_margin_percentage?: number
          description_en?: string | null
          description_fr?: string | null
          description_ty?: string | null
          design_data?: Json
          design_file_info?: Json | null
          generated_mockups?: Json | null
          id?: string
          is_published?: boolean
          name_en?: string | null
          name_fr?: string
          name_ty?: string | null
          original_design_url?: string | null
          preview_url?: string | null
          print_product_id?: string
          seo_description_en?: string | null
          seo_description_fr?: string | null
          seo_description_ty?: string | null
          seo_title_en?: string | null
          seo_title_fr?: string | null
          seo_title_ty?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "creator_products_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_products_print_product_id_fkey"
            columns: ["print_product_id"]
            isOneToOne: false
            referencedRelation: "print_products"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_status_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          creator_id: string
          id: string
          new_level: Database["public"]["Enums"]["creator_level"] | null
          new_status: Database["public"]["Enums"]["creator_status"]
          old_level: Database["public"]["Enums"]["creator_level"] | null
          old_status: Database["public"]["Enums"]["creator_status"] | null
          reason: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          creator_id: string
          id?: string
          new_level?: Database["public"]["Enums"]["creator_level"] | null
          new_status: Database["public"]["Enums"]["creator_status"]
          old_level?: Database["public"]["Enums"]["creator_level"] | null
          old_status?: Database["public"]["Enums"]["creator_status"] | null
          reason?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          creator_id?: string
          id?: string
          new_level?: Database["public"]["Enums"]["creator_level"] | null
          new_status?: Database["public"]["Enums"]["creator_status"]
          old_level?: Database["public"]["Enums"]["creator_level"] | null
          old_status?: Database["public"]["Enums"]["creator_status"] | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_status_history_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      designs: {
        Row: {
          canvas_data: string
          created_at: string | null
          creator_id: string | null
          creator_margin: number | null
          description_en: string | null
          description_fr: string | null
          description_ty: string | null
          id: string
          is_published: boolean | null
          name_en: string | null
          name_fr: string
          name_ty: string | null
          preview_url: string
          price: number
          updated_at: string | null
        }
        Insert: {
          canvas_data: string
          created_at?: string | null
          creator_id?: string | null
          creator_margin?: number | null
          description_en?: string | null
          description_fr?: string | null
          description_ty?: string | null
          id?: string
          is_published?: boolean | null
          name_en?: string | null
          name_fr: string
          name_ty?: string | null
          preview_url: string
          price: number
          updated_at?: string | null
        }
        Update: {
          canvas_data?: string
          created_at?: string | null
          creator_id?: string | null
          creator_margin?: number | null
          description_en?: string | null
          description_fr?: string | null
          description_ty?: string | null
          id?: string
          is_published?: boolean | null
          name_en?: string | null
          name_fr?: string
          name_ty?: string | null
          preview_url?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designs_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      interface_translations: {
        Row: {
          category: string | null
          created_at: string
          id: string
          key: string
          updated_at: string
          value_en: string | null
          value_fr: string | null
          value_ty: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value_en?: string | null
          value_fr?: string | null
          value_ty?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value_en?: string | null
          value_fr?: string | null
          value_ty?: string | null
        }
        Relationships: []
      }
      media_files: {
        Row: {
          created_at: string | null
          file_size: number
          file_type: string
          file_url: string
          filename: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_size: number
          file_type: string
          file_url: string
          filename: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_size?: number
          file_type?: string
          file_url?: string
          filename?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          design_id: string | null
          id: string
          print_product_id: string | null
          quantity: number
          shipping_address: Json
          size: string
          status: string
          template_id: string | null
          total_price: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          design_id?: string | null
          id?: string
          print_product_id?: string | null
          quantity: number
          shipping_address: Json
          size: string
          status?: string
          template_id?: string | null
          total_price: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          design_id?: string | null
          id?: string
          print_product_id?: string | null
          quantity?: number
          shipping_address?: Json
          size?: string
          status?: string
          template_id?: string | null
          total_price?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "product_pricing"
            referencedColumns: ["design_id"]
          },
          {
            foreignKeyName: "orders_print_product_id_fkey"
            columns: ["print_product_id"]
            isOneToOne: false
            referencedRelation: "print_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "product_pricing"
            referencedColumns: ["template_id"]
          },
          {
            foreignKeyName: "orders_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "tshirt_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content_en: string | null
          content_fr: string
          content_ty: string | null
          created_at: string | null
          id: string
          slug: string | null
          title_en: string | null
          title_fr: string
          title_ty: string | null
          updated_at: string | null
        }
        Insert: {
          content_en?: string | null
          content_fr: string
          content_ty?: string | null
          created_at?: string | null
          id?: string
          slug?: string | null
          title_en?: string | null
          title_fr: string
          title_ty?: string | null
          updated_at?: string | null
        }
        Update: {
          content_en?: string | null
          content_fr?: string
          content_ty?: string | null
          created_at?: string | null
          id?: string
          slug?: string | null
          title_en?: string | null
          title_fr?: string
          title_ty?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      print_products: {
        Row: {
          available_colors: string[]
          available_sizes: string[]
          base_price: number
          created_at: string
          description_en: string | null
          description_fr: string | null
          description_ty: string | null
          id: string
          images: string[]
          is_active: boolean
          material: string
          name_en: string | null
          name_fr: string
          name_ty: string | null
          print_areas: Json
          printer_id: string
          status: string | null
          stock_quantity: number
          template_id: string
          updated_at: string
        }
        Insert: {
          available_colors?: string[]
          available_sizes?: string[]
          base_price: number
          created_at?: string
          description_en?: string | null
          description_fr?: string | null
          description_ty?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          material: string
          name_en?: string | null
          name_fr: string
          name_ty?: string | null
          print_areas?: Json
          printer_id: string
          status?: string | null
          stock_quantity?: number
          template_id: string
          updated_at?: string
        }
        Update: {
          available_colors?: string[]
          available_sizes?: string[]
          base_price?: number
          created_at?: string
          description_en?: string | null
          description_fr?: string | null
          description_ty?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          material?: string
          name_en?: string | null
          name_fr?: string
          name_ty?: string | null
          print_areas?: Json
          printer_id?: string
          status?: string | null
          stock_quantity?: number
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "print_products_printer_id_fkey"
            columns: ["printer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "print_products_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "product_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      printer_emails: {
        Row: {
          attachments: Json | null
          creator_product_id: string
          delivery_status: string | null
          email_content: string
          email_subject: string
          id: string
          order_id: string
          printer_email: string
          sent_at: string
        }
        Insert: {
          attachments?: Json | null
          creator_product_id: string
          delivery_status?: string | null
          email_content: string
          email_subject: string
          id?: string
          order_id: string
          printer_email: string
          sent_at?: string
        }
        Update: {
          attachments?: Json | null
          creator_product_id?: string
          delivery_status?: string | null
          email_content?: string
          email_subject?: string
          id?: string
          order_id?: string
          printer_email?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "printer_emails_creator_product_id_fkey"
            columns: ["creator_product_id"]
            isOneToOne: false
            referencedRelation: "creator_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "printer_emails_creator_product_id_fkey"
            columns: ["creator_product_id"]
            isOneToOne: false
            referencedRelation: "creator_products_with_pricing"
            referencedColumns: ["id"]
          },
        ]
      }
      printers: {
        Row: {
          address: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          notes: string | null
          phone: string | null
          specialties: string[]
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          phone?: string | null
          specialties?: string[]
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          specialties?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      product_mockups: {
        Row: {
          created_at: string
          display_order: number
          has_print_area: boolean
          id: string
          is_primary: boolean
          mockup_name: string
          mockup_url: string
          print_area: Json | null
          product_template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          has_print_area?: boolean
          id?: string
          is_primary?: boolean
          mockup_name: string
          mockup_url: string
          print_area?: Json | null
          product_template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          has_print_area?: boolean
          id?: string
          is_primary?: boolean
          mockup_name?: string
          mockup_url?: string
          print_area?: Json | null
          product_template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_mockups_product_template_id_fkey"
            columns: ["product_template_id"]
            isOneToOne: false
            referencedRelation: "product_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      product_templates: {
        Row: {
          available_colors: string[] | null
          available_positions: string[] | null
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          mockup_image_url: string | null
          name_en: string | null
          name_fr: string
          name_ty: string | null
          primary_mockup_id: string | null
          technical_instructions_en: string | null
          technical_instructions_fr: string | null
          technical_instructions_ty: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          available_colors?: string[] | null
          available_positions?: string[] | null
          created_at?: string | null
          created_by: string
          id?: string
          is_active?: boolean | null
          mockup_image_url?: string | null
          name_en?: string | null
          name_fr: string
          name_ty?: string | null
          primary_mockup_id?: string | null
          technical_instructions_en?: string | null
          technical_instructions_fr?: string | null
          technical_instructions_ty?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          available_colors?: string[] | null
          available_positions?: string[] | null
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          mockup_image_url?: string | null
          name_en?: string | null
          name_fr?: string
          name_ty?: string | null
          primary_mockup_id?: string | null
          technical_instructions_en?: string | null
          technical_instructions_fr?: string | null
          technical_instructions_ty?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_templates_primary_mockup_id_fkey"
            columns: ["primary_mockup_id"]
            isOneToOne: false
            referencedRelation: "product_mockups"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_attempts: {
        Row: {
          attempt_count: number
          attempt_type: string
          blocked_until: string | null
          first_attempt: string
          id: string
          identifier: string
          last_attempt: string
        }
        Insert: {
          attempt_count?: number
          attempt_type: string
          blocked_until?: string | null
          first_attempt?: string
          id?: string
          identifier: string
          last_attempt?: string
        }
        Update: {
          attempt_count?: number
          attempt_type?: string
          blocked_until?: string | null
          first_attempt?: string
          id?: string
          identifier?: string
          last_attempt?: string
        }
        Relationships: []
      }
      reusable_blocks: {
        Row: {
          button_text_en: string | null
          button_text_fr: string | null
          button_text_ty: string | null
          content: Json
          created_at: string
          created_by: string
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          link_url: string | null
          placement: string
          title_en: string | null
          title_fr: string
          title_ty: string | null
          type: string
          updated_at: string
          visibility: string
        }
        Insert: {
          button_text_en?: string | null
          button_text_fr?: string | null
          button_text_ty?: string | null
          content?: Json
          created_at?: string
          created_by: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string | null
          placement: string
          title_en?: string | null
          title_fr: string
          title_ty?: string | null
          type: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          button_text_en?: string | null
          button_text_fr?: string | null
          button_text_ty?: string | null
          content?: Json
          created_at?: string
          created_by?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string | null
          placement?: string
          title_en?: string | null
          title_fr?: string
          title_ty?: string | null
          type?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "reusable_blocks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          design_id: string | null
          id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          design_id?: string | null
          id?: string
          rating: number
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          design_id?: string | null
          id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "designs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_design_id_fkey"
            columns: ["design_id"]
            isOneToOne: false
            referencedRelation: "product_pricing"
            referencedColumns: ["design_id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      security_events: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          commission_rate: number
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          start_date: string
          stripe_subscription_id: string | null
          subscription_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          commission_rate: number
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          start_date?: string
          stripe_subscription_id?: string | null
          subscription_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          commission_rate?: number
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          start_date?: string
          stripe_subscription_id?: string | null
          subscription_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      template_printers: {
        Row: {
          created_at: string
          id: string
          printer_id: string
          template_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          printer_id: string
          template_id: string
        }
        Update: {
          created_at?: string
          id?: string
          printer_id?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_printers_printer_id_fkey"
            columns: ["printer_id"]
            isOneToOne: false
            referencedRelation: "printers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_printers_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "product_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      tshirt_templates: {
        Row: {
          available_sizes: string[]
          base_price: number
          created_at: string | null
          description_en: string | null
          description_fr: string | null
          description_ty: string | null
          id: string
          images: string[]
          material: string
          name_en: string | null
          name_fr: string
          name_ty: string | null
          print_area: Json
          printer_id: string | null
          stock_quantity: number
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          available_sizes: string[]
          base_price: number
          created_at?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_ty?: string | null
          id?: string
          images: string[]
          material: string
          name_en?: string | null
          name_fr: string
          name_ty?: string | null
          print_area: Json
          printer_id?: string | null
          stock_quantity?: number
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          available_sizes?: string[]
          base_price?: number
          created_at?: string | null
          description_en?: string | null
          description_fr?: string | null
          description_ty?: string | null
          id?: string
          images?: string[]
          material?: string
          name_en?: string | null
          name_fr?: string
          name_ty?: string | null
          print_area?: Json
          printer_id?: string | null
          stock_quantity?: number
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tshirt_templates_printer_id_fkey"
            columns: ["printer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tshirt_templates_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "product_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          id: string
          preferred_language: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          preferred_language?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          preferred_language?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          bio_en: string | null
          bio_fr: string | null
          bio_ty: string | null
          created_at: string | null
          creator_level: Database["public"]["Enums"]["creator_level"] | null
          creator_status: Database["public"]["Enums"]["creator_status"] | null
          default_commission: number | null
          email: string
          full_name: string | null
          full_name_en: string | null
          full_name_fr: string | null
          full_name_ty: string | null
          id: string
          is_public_profile: boolean | null
          is_super_admin: boolean | null
          keywords: string[] | null
          onboarding_completed: boolean | null
          products_count: number | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          role: string
          social_links: Json | null
          submitted_for_review_at: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          bio_en?: string | null
          bio_fr?: string | null
          bio_ty?: string | null
          created_at?: string | null
          creator_level?: Database["public"]["Enums"]["creator_level"] | null
          creator_status?: Database["public"]["Enums"]["creator_status"] | null
          default_commission?: number | null
          email: string
          full_name?: string | null
          full_name_en?: string | null
          full_name_fr?: string | null
          full_name_ty?: string | null
          id: string
          is_public_profile?: boolean | null
          is_super_admin?: boolean | null
          keywords?: string[] | null
          onboarding_completed?: boolean | null
          products_count?: number | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role: string
          social_links?: Json | null
          submitted_for_review_at?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          bio_en?: string | null
          bio_fr?: string | null
          bio_ty?: string | null
          created_at?: string | null
          creator_level?: Database["public"]["Enums"]["creator_level"] | null
          creator_status?: Database["public"]["Enums"]["creator_status"] | null
          default_commission?: number | null
          email?: string
          full_name?: string | null
          full_name_en?: string | null
          full_name_fr?: string | null
          full_name_ty?: string | null
          id?: string
          is_public_profile?: boolean | null
          is_super_admin?: boolean | null
          keywords?: string[] | null
          onboarding_completed?: boolean | null
          products_count?: number | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role?: string
          social_links?: Json | null
          submitted_for_review_at?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      creator_products_with_pricing: {
        Row: {
          base_price: number | null
          created_at: string | null
          creator_id: string | null
          creator_margin_percentage: number | null
          description: string | null
          design_data: Json | null
          final_price: number | null
          id: string | null
          is_published: boolean | null
          name: string | null
          preview_url: string | null
          print_product_id: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_products_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_products_print_product_id_fkey"
            columns: ["print_product_id"]
            isOneToOne: false
            referencedRelation: "print_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_pricing: {
        Row: {
          base_price: number | null
          commission_rate: number | null
          creator_id: string | null
          creator_margin: number | null
          design_id: string | null
          design_name: string | null
          design_price: number | null
          final_price: number | null
          subtotal: number | null
          template_id: string | null
          template_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designs_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_earnings: {
        Args: { order_id: string }
        Returns: {
          creator_id: string
          printer_id: string
          creator_earnings: number
          printer_earnings: number
          platform_earnings: number
        }[]
      }
      change_creator_status: {
        Args: {
          creator_id: string
          new_status: Database["public"]["Enums"]["creator_status"]
          new_level?: Database["public"]["Enums"]["creator_level"]
          changed_by?: string
          reason?: string
        }
        Returns: boolean
      }
      check_email_exists: {
        Args: { user_email: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: {
          identifier: string
          attempt_type: string
          max_attempts?: number
          window_minutes?: number
        }
        Returns: boolean
      }
      check_rate_limit_enhanced: {
        Args: {
          identifier: string
          attempt_type: string
          max_attempts?: number
          window_minutes?: number
          ip_address?: unknown
        }
        Returns: boolean
      }
      create_creator_notification: {
        Args: {
          creator_id: string
          notification_type: string
          title: string
          message: string
        }
        Returns: string
      }
      delete_auth_user: {
        Args: { user_id: string }
        Returns: boolean
      }
      enhanced_rate_limit_check: {
        Args: {
          identifier: string
          attempt_type: string
          max_attempts?: number
          window_minutes?: number
          block_duration_minutes?: number
        }
        Returns: boolean
      }
      get_auth_users_for_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          created_at: string
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      log_admin_action: {
        Args: {
          action_type: string
          target_table?: string
          target_id?: string
          details?: Json
          ip_address?: unknown
          user_agent?: string
        }
        Returns: string
      }
      log_security_event: {
        Args: {
          event_type: string
          user_id?: string
          ip_address?: unknown
          user_agent?: string
          details?: Json
          severity?: string
        }
        Returns: string
      }
      promote_to_super_admin: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      reset_user_account: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      secure_promote_to_super_admin: {
        Args: { target_user_id: string; target_email: string }
        Returns: boolean
      }
      validate_admin_operation: {
        Args: { operation_type: string }
        Returns: boolean
      }
      validate_user_role_secure: {
        Args: { required_role: string }
        Returns: boolean
      }
    }
    Enums: {
      creator_level: "debutant" | "confirme" | "premium"
      creator_status: "draft" | "pending" | "approved" | "rejected"
      user_role: "superAdmin" | "admin" | "imprimeur" | "créateur"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      creator_level: ["debutant", "confirme", "premium"],
      creator_status: ["draft", "pending", "approved", "rejected"],
      user_role: ["superAdmin", "admin", "imprimeur", "créateur"],
    },
  },
} as const
