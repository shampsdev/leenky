interface User {
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  avatar: string;
  company: string;
  role: string;
}

const fetchUser = (user_id: string): User => {
  return {
    username: "johndoe",
    firstName: "John",
    lastName: "Doe",
    bio: "Software Engineer at ShampsDev.",
    avatar: "https://example.com/avatar.jpg",
    company: "XYZ Corp.",
    role: "Developer",
  };
};

export default fetchUser;
