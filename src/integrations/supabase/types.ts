export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      creator_products: {
        Row: {
          created_at: string
          creator_id: string
          creator_margin_percentage: number
          description: string | null
          design_data: Json
          id: string
          is_published: boolean
          name: string
          preview_url: string | null
          print_product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          creator_margin_percentage?: number
          description?: string | null
          design_data?: Json
          id?: string
          is_published?: boolean
          name: string
          preview_url?: string | null
          print_product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          creator_margin_percentage?: number
          description?: string | null
          design_data?: Json
          id?: string
          is_published?: boolean
          name?: string
          preview_url?: string | null
          print_product_id?: string
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
      designs: {
        Row: {
          canvas_data: string
          created_at: string | null
          creator_id: string | null
          creator_margin: number | null
          description: string | null
          id: string
          is_published: boolean | null
          name: string
          preview_url: string
          price: number
          updated_at: string | null
        }
        Insert: {
          canvas_data: string
          created_at?: string | null
          creator_id?: string | null
          creator_margin?: number | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          name: string
          preview_url: string
          price: number
          updated_at?: string | null
        }
        Update: {
          canvas_data?: string
          created_at?: string | null
          creator_id?: string | null
          creator_margin?: number | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          name?: string
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
          content: string
          created_at: string | null
          id: string
          slug: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          slug?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          slug?: string | null
          title?: string
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
          description: string | null
          id: string
          images: string[]
          is_active: boolean
          material: string
          name: string
          print_areas: Json
          printer_id: string
          stock_quantity: number
          template_id: string
          updated_at: string
        }
        Insert: {
          available_colors?: string[]
          available_sizes?: string[]
          base_price: number
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          material: string
          name: string
          print_areas?: Json
          printer_id: string
          stock_quantity?: number
          template_id: string
          updated_at?: string
        }
        Update: {
          available_colors?: string[]
          available_sizes?: string[]
          base_price?: number
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          material?: string
          name?: string
          print_areas?: Json
          printer_id?: string
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
      product_templates: {
        Row: {
          available_colors: string[] | null
          available_positions: string[] | null
          created_at: string | null
          created_by: string
          design_area: Json
          id: string
          is_active: boolean | null
          mockup_area: Json | null
          mockup_image_url: string
          name: string
          svg_file_url: string
          technical_instructions: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          available_colors?: string[] | null
          available_positions?: string[] | null
          created_at?: string | null
          created_by: string
          design_area: Json
          id?: string
          is_active?: boolean | null
          mockup_area?: Json | null
          mockup_image_url: string
          name: string
          svg_file_url: string
          technical_instructions?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          available_colors?: string[] | null
          available_positions?: string[] | null
          created_at?: string | null
          created_by?: string
          design_area?: Json
          id?: string
          is_active?: boolean | null
          mockup_area?: Json | null
          mockup_image_url?: string
          name?: string
          svg_file_url?: string
          technical_instructions?: string | null
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
        ]
      }
      reusable_blocks: {
        Row: {
          button_text: string | null
          content: Json
          created_at: string
          created_by: string
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          link_url: string | null
          placement: string
          title: string
          type: string
          updated_at: string
          visibility: string
        }
        Insert: {
          button_text?: string | null
          content?: Json
          created_at?: string
          created_by: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string | null
          placement: string
          title: string
          type: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          button_text?: string | null
          content?: Json
          created_at?: string
          created_by?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string | null
          placement?: string
          title?: string
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
      tshirt_templates: {
        Row: {
          available_sizes: string[]
          base_price: number
          created_at: string | null
          description: string | null
          id: string
          images: string[]
          material: string
          name: string
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
          description?: string | null
          id?: string
          images: string[]
          material: string
          name: string
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
          description?: string | null
          id?: string
          images?: string[]
          material?: string
          name?: string
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
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          default_commission: number | null
          full_name: string | null
          id: string
          is_super_admin: boolean | null
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          default_commission?: number | null
          full_name?: string | null
          id: string
          is_super_admin?: boolean | null
          role: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          default_commission?: number | null
          full_name?: string | null
          id?: string
          is_super_admin?: boolean | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
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
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
    }
    Enums: {
      user_role: "superAdmin" | "admin" | "imprimeur" | "créateur"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["superAdmin", "admin", "imprimeur", "créateur"],
    },
  },
} as const
