import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaCartPlus,
  FaFilter,
  FaGithub,
  FaLink,
  FaNewspaper,
  FaReact,
  FaSignInAlt,
} from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdBuild, MdDynamicForm, MdFindInPage } from "react-icons/md";
import { RiTailwindCssFill } from "react-icons/ri";
import {
  SiDocker,
  SiMysql,
  SiNextdotjs,
  SiPrisma,
  SiRedux,
  SiShadcnui,
} from "react-icons/si";
import { TiFilter } from "react-icons/ti";

const features = [
  {
    title: "Filters and Sorting",
    description:
      "Our products page features a comprehensive set of filters, including ratings, text search, price range, color, discount, and sorting by price. React Context API is used to manage these filter states, with values stored in URL parameters for a shareable link experience.",
    icon: TiFilter,
  },
  {
    title: "Dynamic Cart Icon",
    description:
      "The cart icon in the navbar updates dynamically using an event emitter from the events library, reflecting real-time item counts.",
    icon: IoMdCart,
  },
  {
    title: "Fully Responsive",
    description:
      "Our site is designed to be fully responsive, ensuring a seamless user experience across all devices.",
    icon: FaReact,
  },
  {
    title: "Shadcn Components",
    description:
      "We use a variety of Shadcn UI components to speed up development, including carousels, labels, and input boxes, enhancing both functionality and visual appeal.",
    icon: MdBuild,
  },
];

const About = () => {
  return (
    <div className=" min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-[93dvh] flex items-center justify-center bg-stone-950 text-white overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full blur-lg"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827"
            className="fill-current text-gray-700 animate-path"
          />
          <path
            d="M0 0C0 0 200 500 400 500C600 500 800 800 1000 500C1200 200 1400 -100 1600 100"
            className="fill-current text-gray-600 opacity-50 animate-path"
          />
        </svg>
        <div className="relative text-center z-10 px-4">
          <h1 className="text-6xl font-extrabold mb-6 leading-tight">
            CodeBlitz
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            This project is a learning experience I created to dive into
            frontend development with Next.js. Through this project, I have
            explored app directory routing, various optimizations in Next.js,
            linking and routing, better folder structures, and working with URL
            parameters.
          </p>
          <p className=" text-2xl flex items-center justify-center mb-6 text-stone-400 gap-3">
            <SiNextdotjs />
            <FaReact />
            <RiTailwindCssFill />
            <SiShadcnui />
            <SiRedux />
            <SiPrisma />
            <SiDocker />
            <SiMysql size={35} />
          </p>
          <Link href={"/products"}>
            <Button className="bg-stone-900 border border-stone-600 hover:bg-stone-800 transition-transform transform hover:scale-105">
              <FaGithub className="mr-2 text-2xl" />
              View Code on GitHub
            </Button>
          </Link>
        </div>
      </section>

      <DesignAndFeatures />
    </div>
  );
};

export default About;

function DesignAndFeatures() {
  const features = [
    {
      title: "Dynamic Routing",
      description:
        "Site uses dynamic routing using app directory to handle multiple pages efficiently, providing a seamless user experience.",
      icon: <MdDynamicForm />,
    },
    {
      title: "Sleek UI Design",
      description:
        "The user interface is designed to be modern and visually appealing, ensuring a smooth and attractive experience for users.",
      icon: <FaNewspaper />,
    },
    {
      title: "Easy URL Sharing",
      description:
        "Filters and search parameters are saved in the URL, allowing easy sharing of filtered views and search results.",
      icon: <FaLink />,
    },
    {
      title: "Landing Page",
      description:
        "The landing page provides a welcoming introduction to the site, highlighting key features and offerings.",
      icon: <FaCalendarAlt />,
    },
    {
      title: "Products Page with Pagination",
      description:
        "Browse through products with pagination to manage large listings efficiently and improve load times.",
      icon: <MdFindInPage />,
    },
    {
      title: "Comprehensive Product Filters",
      description:
        "Features include filters for ratings, price range, color, and discount, managed using React Context API.",
      icon: <FaFilter />,
    },
    {
      title: "Login and Signup Pages",
      description:
        "User authentication is handled through dedicated login and signup pages, offering a secure and intuitive experience.",
      icon: <FaSignInAlt />,
    },
    {
      title: "Real-Time Cart Functionality",
      description:
        "The cart icon updates dynamically to reflect the real-time count of items in the cart, enhancing user interaction.",
      icon: <FaCartPlus />,
    },
  ];

  return (
    <section
      id="design-features"
      className="relative z-10 py-10 max-w-7xl mx-auto"
    >
      <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">
        Design and Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ title, description, icon }, index) => (
          <Feature
            key={title}
            title={title}
            description={description}
            icon={icon}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800",
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-xl text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-stone-800 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
