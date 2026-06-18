import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/modules/product/ProductDetail";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  return {
    title: product.title,
    description: product.description,
    alternates: {
      canonical: `/product/${product.slug}`
    },
    openGraph: {
      type: "website",
      title: `${product.title} | Designers Drama`,
      description: product.description,
      url: `/product/${product.slug}`,
      siteName: "Designers Drama",
      images: [
        {
          url: product.images[0],
          alt: `${product.title} by Designers Drama`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Designers Drama`,
      description: product.description,
      images: [product.images[0]]
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
