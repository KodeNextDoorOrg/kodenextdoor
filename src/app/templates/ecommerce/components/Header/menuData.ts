import { Menu } from "../../types/Menu";

export const menuData: Menu[] = [
  {
    id: 1,
    title: "Popular",
    newTab: false,
    path: "/templates/ecommerce",
  },
  {
    id: 2,
    title: "Shop",
    newTab: false,
    path: "/templates/ecommerce/shop-with-sidebar",
  },
  {
    id: 3,
    title: "Contact",
    newTab: false,
    path: "/templates/ecommerce/contact",
  },
  {
    id: 6,
    title: "pages",
    newTab: false,
    path: "/templates/ecommerce",
    submenu: [
      {
        id: 61,
        title: "Shop With Sidebar",
        newTab: false,
        path: "/templates/ecommerce/shop-with-sidebar",
      },
      {
        id: 62,
        title: "Shop Without Sidebar",
        newTab: false,
        path: "/templates/ecommerce/shop-without-sidebar",
      },
      {
        id: 64,
        title: "Checkout",
        newTab: false,
        path: "/templates/ecommerce/checkout",
      },
      {
        id: 65,
        title: "Cart",
        newTab: false,
        path: "/templates/ecommerce/cart",
      },
      {
        id: 66,
        title: "Wishlist",
        newTab: false,
        path: "/templates/ecommerce/wishlist",
      },
      {
        id: 67,
        title: "Sign in",
        newTab: false,
        path: "/templates/ecommerce/signin",
      },
      {
        id: 68,
        title: "Sign up",
        newTab: false,
        path: "/templates/ecommerce/signup",
      },
      {
        id: 69,
        title: "My Account",
        newTab: false,
        path: "/templates/ecommerce/my-account",
      },
      {
        id: 70,
        title: "Contact",
        newTab: false,
        path: "/templates/ecommerce/contact",
      },
      {
        id: 62,
        title: "Error",
        newTab: false,
        path: "/templates/ecommerce/error",
      },
      {
        id: 63,
        title: "Mail Success",
        newTab: false,
        path: "/templates/ecommerce/mail-success",
      },
    ],
  },
  {
    id: 7,
    title: "blogs",
    newTab: false,
    path: "/templates/ecommerce",
    submenu: [
      {
        id: 71,
        title: "Blog Grid with sidebar",
        newTab: false,
        path: "/templates/ecommerce/blogs/blog-grid-with-sidebar",
      },
      {
        id: 72,
        title: "Blog Grid",
        newTab: false,
        path: "/templates/ecommerce/blogs/blog-grid",
      },
      {
        id: 73,
        title: "Blog details with sidebar",
        newTab: false,
        path: "/templates/ecommerce/blogs/blog-details-with-sidebar",
      },
      {
        id: 74,
        title: "Blog details",
        newTab: false,
        path: "/templates/ecommerce/blogs/blog-details",
      },
    ],
  },
];
