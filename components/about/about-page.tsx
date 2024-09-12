import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  FaCogs,
  FaDatabase,
  FaDocker,
  FaNetworkWired,
  FaShieldAlt,
  FaSyncAlt,
} from "react-icons/fa";
import { MdCode, MdOutlineIntegrationInstructions } from "react-icons/md";

import { FaGithub, FaReact } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdBuild } from "react-icons/md";
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

const AboutPage = () => {
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
          <p className="text-lg mb-8 max-w-4xl mx-auto">
            This project is a learning experience I created to dive into the
            basics of Docker and Docker Compose while building a DSA
            problem-solving platform similar to leetcode with boiled down
            functionalities. Through this project, I have explored core Docker
            functionalities such as containerization, working with Docker
            volumes, and managing file permissions within volumes. I also gained
            hands-on experience with Prisma ORM connected to a MySQL database.
            The platform is fully Dockerized, with both the website and code
            runners running in isolated Docker containers. The Next.js container
            interacts with the code runner containers using Docker-in-Docker
            (DinD) configuration, enabling seamless execution of user-submitted
            code. By exposing Docker Socket from the host machine and installing
            Docker within the Next.js container, I was able to achieve this
            integration. This project was a fun and educational experience,
            deepening my understanding of how Docker can be leveraged in a
            real-world application.
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

export default AboutPage;

function DesignAndFeatures() {
  const features = [
    {
      title: "Dockerized Code Runners",
      description:
        "Each code submission is executed within its own Docker container, ensuring isolated and secure environments for running code.",
      icon: <FaDocker />,
    },
    {
      title: "Docker-in-Docker Setup",
      description:
        "The Next.js container interacts with other containers using Docker-in-Docker configuration, allowing the platform to manage and run code within containers seamlessly.",
      icon: <MdOutlineIntegrationInstructions />,
    },
    {
      title: "Prisma ORM with MySQL",
      description:
        "Utilizes Prisma ORM to interact with a MySQL database, providing efficient and type-safe database operations.",
      icon: <FaDatabase />,
    },
    {
      title: "Volumes and File Permissions",
      description:
        "Manages Docker volumes and file permissions to securely store and handle code submissions, logs, and outputs.",
      icon: <FaShieldAlt />,
    },
    {
      title: "Containerized Web Interface",
      description:
        "The entire web platform, built with Next.js, runs within a Docker container, enabling consistent and replicable deployments.",
      icon: <FaNetworkWired />,
    },
    {
      title: "Automated Environment Setup",
      description:
        "Using Docker Compose, the platform automates the setup of development and production environments, simplifying the deployment process.",
      icon: <FaCogs />,
    },
    {
      title: "Real-Time Code Execution",
      description:
        "Supports real-time feedback on code submissions by dynamically managing and running containers, enhancing the coding experience.",
      icon: <MdCode />,
    },
    {
      title: "Continuous Integration",
      description:
        "Integrates with CI/CD pipelines to ensure that all containers and services are up-to-date, providing a reliable and consistent platform.",
      icon: <FaSyncAlt />,
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
