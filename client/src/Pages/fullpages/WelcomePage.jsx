// Welcome.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../../utils/constants/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TypeAnimation } from "react-type-animation";
import config from "../../../utils/config/index";
import slide1 from "../../assets/nodeproject/book1.png";
import slide2 from "../../assets/nodeproject/book2.png";
import slide3 from "../../assets/nodeproject/book3.png";
import slide4 from "../../assets/nodeproject/book4.png";
import BookSlider from "../../components/resusable/welcomePage_compo/BookSlider";
import WelcomeText from "../../components/resusable/welcomePage_compo/WelcomeText";
import LibrarySlider from "../../components/resusable/welcomePage_compo/LibrarySlider";
import CategorySlider from "../../components/resusable/welcomePage_compo/Categories";
import TestimonialSlider from "../../components/resusable/welcomePage_compo/TestimonialSlider";

const WelcomePage = () => {
  const [books, setBooks] = useState([]);
  const [mostLikedBooks, setMostLikedBooks] = useState([]);
  const [startAnimation, setStartAnimation] = useState(false);
  const [testimonials, setTestimonials] = useState([]);

  // Reusable function to fetch books
  const fetchBooks = async (endpoint, setState) => {
    const token = localStorage.getItem("jwt_token");
    try {
      const response = await axiosInstance.get(`${config.API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setState(response.data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Fetching reviews
  const fetchReviews = async (endpoint, setState) => {
    const token = localStorage.getItem("jwt_token");
    try {
      const response = await axiosInstance.get(`${config.API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setState(response.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchBooks("/common/recently-added-books", setBooks);
    fetchBooks("/common/most-liked-books", setMostLikedBooks);
    fetchReviews("/common/get-reviews", setTestimonials);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const images = [slide1, slide2, slide3, slide4];

  const bookSliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const imageSliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const categories = [
    {
      name: "Fiction",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYxF-MJHgxLEUGYMSGprn4rW0yUoDuIYP3vA&s",
    },
    {
      name: "Romantic",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhgqWp2j4Upgfe3ziAWt7yR57D6QQzYxOu5Q&s",
    },
    {
      name: "Horror",
      imageUrl:
        "https://static.vecteezy.com/system/resources/thumbnails/024/032/590/small/horror-a-demon-girl-peeking-out-of-the-darkness-against-the-backdrop-of-an-old-wooden-house-generative-ai-photo.jpg",
    },
    {
      name: "Children",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEbyeUZp0kt_otq9HezaGxSvLQbdNrx-IWPg&s",
    },
    {
      name: "Comedy",
      imageUrl:
        "https://media.istockphoto.com/id/533837393/photo/clown.jpg?s=612x612&w=0&k=20&c=2uitATXPXAq-nNzSYgT1heMsuep3_nSRZqviBAbmhbE=",
    },
    {
      name: "Suspense",
      imageUrl:
        "https://dnm.nflximg.net/api/v6/BvVbc2Wxr2w6QuoANoSpJKEIWjQ/AAAAQdblyy05paCMJirwJduRJgw4f9QAfgnXw51-4J8hC5Sg6nFW31KazJN8A7HM36TLAkS2j05hLgbHCE3GzKTl6-8105X61QuIVm4WGy7pWyQJ4Nyx5jOXjpbva2BTk0IX5BWujIr_sHxLFDTvLw.jpg?r=60e",
    },
    {
      name: "Biography",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfNTDOA0-i5zEpo1nZQ0svvBfOgHLIXw_xWw&s",
    },
    {
      name: "Life",
      imageUrl:
        "https://static.toiimg.com/thumb/msid-112543392,width-1280,height-720,resizemode-4/112543392.jpg",
    },
    {
      name: "Society",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf3fxd1CNGLAaIh0GfmOXEFwgfjGW5ffFhUQ&s",
    },
    {
      name: "Short stories",
      imageUrl:
        "https://i.pinimg.com/736x/32/52/e0/3252e063d325474aef81dc591fa3fc08.jpg",
    },
    {
      name: "History",
      imageUrl: "https://f.hubspotusercontent10.net/hubfs/6448316/history.jpg",
    },
    {
      name: "Drama",
      imageUrl:
        "https://images.jdmagicbox.com/quickquotes/listicle/listicle_1693283980924_w72nk_966x609.jpg",
    },
    {
      name: "Action",
      imageUrl: "https://satishrao.in/wp-content/uploads/2014/11/action.jpg",
    },
    {
      name: "Adventure",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScMzQr6bo3Sm31isuuHTiXFuB73cLYuXcK6Q&s",
    },
    {
      name: "Mythology",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/62fbfbed423b4f1bb8caed31/7354c52e-197d-4330-ba58-556dfb6426c5/v2-5kesp-34t3s.jpg",
    },
    {
      name: "Travel",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB-3rSvVGmCA_g31gQHOzTpy4cGc1BB4ZyBQ&s",
    },
  ];

  // content for mapping
  const sliderContent = [
    {
      image:
        "https://images.pexels.com/photos/762686/pexels-photo-762686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      heading: "Why Library Management System",
      text: [
        "Library management system is a project which aims in developing a computerizedsystem to maintain all the daily work of library .This project has many featureswhich are generally not available in normal library management systems likefacility of user login and a facility of teachers login.",
        " It also has a facility of adminlogin through which the admin can monitor the whole system .It also has facility ofan online notice board where teachers can student can put up information aboutworkshops or seminars being held in our colleges or nearby colleges and librarianafter proper verification from the concerned institution organizing the seminar canadd it to the notice board.",
      ],
    },
    {
      image:
        "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      heading: "usefull for user",
      text: [
        "It has also a facility where student after logging in theiraccounts can see list of books issued and its issue date and return date and also thestudents can request the librarian to add new books by filling the book requestform.",
        " The librarian after logging into his account that is admin account cangenerate various reports such as student report , issue report, teacher report andbook reportOverall this project of ours is being developed to help the students as well as staffof library to maintain the library in the best way possible and also reduce thehuman effort.",
        "Lorem ipsum dolor, sit amet consectetaliquam cumque iusto quia eligendi laboriosam et nulla!",
      ],
    },
    {
      image:
        "https://images.pexels.com/photos/4170629/pexels-photo-4170629.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      heading: "Balancing Dreams and Deadlines",
      text: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus excepturi commodi voluptatum vel natus veritatis, illo cupiditate dolor saepe quia consequatur provident laboriosam molestias ipsum perferendis rerum est alias quaerat.",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur nulla possimus neque, consequatur repudiandae ad! Aliquid fugiat, quam laudantium necessitatibus omnis dolor, nihil enim soluta cum exercitationem, aut quia veritatis?",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet veritatis explicabo dolor maxime quod quisquam molestiae, eius autem cumque assumenda dolorem.",
      ],
    },
  ];
  const pratilipiCards = [
    {
      image: "https://www.pratilipi.com/images/feature-read.webp",
      title: "Read",
      description:
        "Discover thousands of stories, poems, articles, magazines, novels, essays, etc for free. Read popular genres. Save your favourites in your own library. Contents present in the Pratilipi library are filled with endless emotions, thoughts, verses, and possibilities.",
    },
    {
      image: "https://www.pratilipi.com/images/feature-write.webp",
      title: "Write",
      description:
        "Self-publish on Pratilipi and join the largest community of writers. Create new drafts, add images and publish right from the app. Pratilipi provides a hassle free and advanced writer panel to make your act of writing a little less scary and a whole lot comforting.",
    },
    {
      image: "https://www.pratilipi.com/images/feature-involve.webp",
      title: "Get Involved",
      description:
        "Pratilipi brings writers and readers on a single platform. Follow authors to see what they are publishing next, review and discuss. Share your favourites with your fellow readers. Here writers can interact directly with readers and readers can often evolve into writers.",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full">
      {/* Header */}
      <header className="text-center pt-10 w-full">
        <h1 className="text-gray-800 font-semibold flex flex-col space-y-2">
          <span className="text-md sm:text-lg text-gray-600">
            Hello, {localStorage.getItem("firstName")}{" "}
            {localStorage.getItem("lastName")}
          </span>
          <TypeAnimation
            className="text-2xl sm:text-4xl font-serif font-bold"
            sequence={["Welcome to the Magic Book Library!", 2000]}
            speed={50}
            repeat={Infinity}
          />

          {startAnimation && (
            <TypeAnimation
              className="mt-2 sm:text-xl text-md text-gray-700"
              sequence={["Your gateway to endless knowledge!", 1000]}
              speed={50}
              repeat={Infinity}
            />
          )}
        </h1>
      </header>

      {/* Image Slider */}
      <section className="mt-12 w-[93%] max-w-6xl sm:w-[90%] relative slide-in fade-in">
        <div>
          <Slider {...imageSliderSettings}>
            {images.map((image, index) => (
              <div key={index} className="p-0 sm:p-4">
                <img
                  src={image}
                  alt={`Library Image ${index + 1}`}
                  className="w-full h-[250px] sm:w-full sm:h-[500px] sm:object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Welcome Text */}
      <WelcomeText />

      {/* button  */}
      <section>
        <div className="my-7 transition-all duration-300 ease-in-out transform hover:scale-125">
          <Link
            to={localStorage.getItem("role") === "student" ? "/books" : "/home"}
            className="bg-[#142534] text-white lg:py-2 lg:px-6 sm:py-2 sm:px-2 sm300:py-4 sm300:px-4 sm:text-sm rounded-full lg:text-lg w-full text-center "
          >
            Explore the Library
          </Link>
        </div>
      </section>

      {/* book card via pratilipi */}
      <section className="text-center">
        <div className="max-w-screen-xl mx-auto grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-20 text-center">
          {pratilipiCards.map((card, index) => (
            <div
              key={index}
              className="bg-white p-8 max-w-xs mx-auto rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:bg-gray-100"
            >
              <img
                src={card.image}
                alt={card.title}
                className="mx-auto -mt-2"
              />
              <div className="mt-6">
                <div className="font-bold text-xl text-black">{card.title}</div>
                <p className="text-sm mt-4 leading-6 text-black opacity-55">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Library Slider */}
      <LibrarySlider
        sliderContent={sliderContent}
        imageSliderSettings={imageSliderSettings}
      />

      {/* Most Liked Books Section */}
      <BookSlider
        title="Our Most Liked Books"
        link="/Bookshow"
        books={mostLikedBooks}
        sliderSettings={bookSliderSettings}
      />

      {/* New Arrivals Section */}
      <BookSlider
        title="New Arrivals"
        link="/Bookshow"
        books={books}
        sliderSettings={bookSliderSettings}
      />

      {/* category section  */}
      <CategorySlider
        categories={categories}
        sliderSettings={bookSliderSettings}
      />

      {/* review page  */}
      <section className="mb-10 w-[90%] max-w-6xl sm:w-[90%] relative">
        <TestimonialSlider testimonials={testimonials} />
      </section>

    </div>
  );
};

export default WelcomePage;
