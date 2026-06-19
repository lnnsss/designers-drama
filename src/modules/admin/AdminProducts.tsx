"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getAdminRedirectUrl, isSupabaseConfigured } from "@/lib/supabase/config";
import { formatPrice } from "@/lib/formatPrice";
import styles from "./AdminProducts.module.css";

const ADMIN_EMAIL = "designersdrama@gmail.com";

type ProductStatus = "draft" | "published";

type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  storage_path: string | null;
  alt: string;
  sort_order: number;
};

type AdminProduct = {
  id: string;
  slug: string;
  title: string;
  price: number;
  description: string;
  category: string;
  sizes: string[];
  stock: number;
  status: ProductStatus;
  sort_order: number;
  product_images: ProductImage[];
};

type ProductFormState = {
  id: string | null;
  slug: string;
  title: string;
  price: string;
  description: string;
  category: string;
  sizes: string;
  stock: string;
  status: ProductStatus;
  sortOrder: string;
};

const emptyForm: ProductFormState = {
  id: null,
  slug: "",
  title: "",
  price: "",
  description: "",
  category: "Accessories",
  sizes: "One size",
  stock: "0",
  status: "draft",
  sortOrder: "0"
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formFromProduct(product: AdminProduct): ProductFormState {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: String(product.price),
    description: product.description,
    category: product.category,
    sizes: product.sizes.join(", "),
    stock: String(product.stock),
    status: product.status,
    sortOrder: String(product.sort_order)
  };
}

export function AdminProducts() {
  const supabase = useMemo(() => (isSupabaseConfigured ? createClient() : null), []);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? null;
  const isAdmin = user?.email === ADMIN_EMAIL;

  const loadProducts = useCallback(async () => {
    if (!supabase) {
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        slug,
        title,
        price,
        description,
        category,
        sizes,
        stock,
        status,
        sort_order,
        product_images (
          id,
          product_id,
          url,
          storage_path,
          alt,
          sort_order
        )
      `)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setProducts((data ?? []) as AdminProduct[]);
  }, [supabase]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
    }
  }, [isAdmin, loadProducts]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast("");
    }, 2600);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  function showSuccessToast(text: string) {
    setToast(text);
  }

  function updateForm(field: keyof ProductFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
      slug: field === "title" && !current.id ? slugify(value) : current.slug
    }));
  }

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setMessage("Fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env first.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getAdminRedirectUrl(window.location.origin)
      }
    });
    setIsLoading(false);

    setMessage(error ? error.message : "Magic Link sent. Check your email.");
  }

  async function signOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setProducts([]);
    setSelectedProductId(null);
    setForm(emptyForm);
  }

  function selectProduct(product: AdminProduct) {
    setSelectedProductId(product.id);
    setForm(formFromProduct(product));
    setMessage("");
  }

  function resetForm() {
    setSelectedProductId(null);
    setForm(emptyForm);
    setMessage("");
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      return;
    }

    const payload = {
      slug: form.slug || slugify(form.title),
      title: form.title,
      price: Number(form.price),
      description: form.description,
      category: form.category,
      sizes: form.sizes.split(",").map((size) => size.trim()).filter(Boolean),
      stock: Number(form.stock),
      status: form.status,
      sort_order: Number(form.sortOrder)
    };

    setIsLoading(true);
    const request = form.id
      ? supabase.from("products").update(payload).eq("id", form.id).select("id").single()
      : supabase.from("products").insert(payload).select("id").single();

    const { data, error } = await request;
    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("");
    showSuccessToast(form.id ? "Changes saved" : "Product created");
    setSelectedProductId(data.id);
    setForm((current) => ({ ...current, id: data.id }));
    await loadProducts();
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !supabase || !selectedProduct) {
      return;
    }

    const extension = file.name.split(".").pop() ?? "webp";
    const storagePath = `${selectedProduct.slug}/${crypto.randomUUID()}.${extension}`;

    setIsUploading(true);
    const upload = await supabase.storage
      .from("product-images")
      .upload(storagePath, file, {
        cacheControl: "31536000",
        upsert: false
      });

    if (upload.error) {
      setIsUploading(false);
      setMessage(upload.error.message);
      return;
    }

    const publicUrl = supabase.storage.from("product-images").getPublicUrl(storagePath).data.publicUrl;
    const maxSortOrder = Math.max(0, ...selectedProduct.product_images.map((image) => image.sort_order));

    const insert = await supabase.from("product_images").insert({
      product_id: selectedProduct.id,
      url: publicUrl,
      storage_path: storagePath,
      alt: selectedProduct.title,
      sort_order: maxSortOrder + 10
    });

    setIsUploading(false);
    event.target.value = "";

    if (insert.error) {
      setMessage(insert.error.message);
      return;
    }

    setMessage("");
    showSuccessToast("Image uploaded");
    await loadProducts();
  }

  async function deleteImage(image: ProductImage) {
    if (!supabase) {
      return;
    }

    const { error } = await supabase.from("product_images").delete().eq("id", image.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (image.storage_path) {
      await supabase.storage.from("product-images").remove([image.storage_path]);
    }

    setMessage("");
    showSuccessToast("Image deleted");
    await loadProducts();
  }

  async function deleteProduct() {
    if (!supabase || !selectedProduct) {
      return;
    }

    const storagePaths = selectedProduct.product_images
      .map((image) => image.storage_path)
      .filter((path): path is string => Boolean(path));

    const { error } = await supabase.from("products").delete().eq("id", selectedProduct.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (storagePaths.length > 0) {
      await supabase.storage.from("product-images").remove(storagePaths);
    }

    setMessage("");
    showSuccessToast("Product deleted");
    resetForm();
    await loadProducts();
  }

  if (!isSupabaseConfigured) {
    return (
      <main className={styles.admin}>
        <h1>Admin</h1>
        <p className={styles.notice}>
          Fill `.env` with Supabase URL and publishable key, then restart the dev server.
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.admin}>
        <section className={styles.loginPanel}>
          <h1>Admin login</h1>
          <form onSubmit={sendMagicLink} className={styles.loginForm}>
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
          {message && <p className={styles.message}>{message}</p>}
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className={styles.admin}>
        <section className={styles.loginPanel}>
          <h1>No access</h1>
          <p className={styles.notice}>Signed in as {user.email}. Admin access is limited to {ADMIN_EMAIL}.</p>
          <button type="button" onClick={signOut}>
            Sign out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.admin}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <header className={styles.header}>
        <h1>Products</h1>
      </header>

      <section className={styles.workspace}>
        <aside className={styles.sidebar}>
          <button type="button" className={styles.newButton} onClick={resetForm}>
            New product
          </button>
          <div className={styles.list}>
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                className={product.id === selectedProductId ? styles.activeProduct : ""}
                onClick={() => selectProduct(product)}
              >
                <span>{product.title}</span>
                <small>
                  {product.status} / {formatPrice(product.price)}
                </small>
              </button>
            ))}
          </div>
        </aside>

        <section className={styles.editor}>
          <form className={styles.form} onSubmit={saveProduct}>
            <div className={styles.formHeader}>
              <h2>{form.id ? "Edit product" : "Create product"}</h2>
              {form.id && (
                <button type="button" className={styles.dangerButton} onClick={deleteProduct}>
                  Delete
                </button>
              )}
            </div>

            <div className={styles.grid}>
              <label>
                Title
                <input value={form.title} onChange={(event) => updateForm("title", event.target.value)} required />
              </label>
              <label>
                Slug
                <input value={form.slug} onChange={(event) => updateForm("slug", slugify(event.target.value))} required />
              </label>
              <label>
                Price
                <input type="number" min="0" value={form.price} onChange={(event) => updateForm("price", event.target.value)} required />
              </label>
              <label>
                Stock
                <input type="number" min="0" value={form.stock} onChange={(event) => updateForm("stock", event.target.value)} required />
              </label>
              <label>
                Category
                <input value={form.category} onChange={(event) => updateForm("category", event.target.value)} required />
              </label>
              <label>
                Sizes
                <input value={form.sizes} onChange={(event) => updateForm("sizes", event.target.value)} placeholder="One size, M, L" />
              </label>
              <label>
                Status
                <select value={form.status} onChange={(event) => updateForm("status", event.target.value as ProductStatus)}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label>
                Sort order
                <input type="number" value={form.sortOrder} onChange={(event) => updateForm("sortOrder", event.target.value)} />
              </label>
            </div>

            <label>
              Description
              <textarea value={form.description} onChange={(event) => updateForm("description", event.target.value)} rows={5} />
            </label>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save product"}
            </button>
          </form>

          <section className={styles.images}>
            <div className={styles.formHeader}>
              <h2>Images</h2>
              <label className={selectedProduct ? styles.uploadButton : styles.uploadButtonDisabled}>
                {isUploading ? "Uploading..." : "Upload image"}
                <input type="file" accept="image/*" onChange={uploadImage} disabled={!selectedProduct || isUploading} />
              </label>
            </div>

            {!selectedProduct && <p className={styles.notice}>Save or select a product before uploading images.</p>}

            {selectedProduct && (
              <div className={styles.imageGrid}>
                {selectedProduct.product_images
                  .slice()
                  .sort((left, right) => left.sort_order - right.sort_order)
                  .map((image) => (
                    <article key={image.id} className={styles.imageItem}>
                      <div className={styles.imagePreview}>
                        <Image src={image.url} alt={image.alt} fill sizes="160px" />
                      </div>
                      <button type="button" onClick={() => deleteImage(image)}>
                        Delete
                      </button>
                    </article>
                  ))}
              </div>
            )}
          </section>

          {message && <p className={styles.message}>{message}</p>}
        </section>
      </section>
    </main>
  );
}
