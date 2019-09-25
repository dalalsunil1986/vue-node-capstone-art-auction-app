import login from "../views/auth/login";
import registration from "../views/auth/registration";
import recovery from "../views/auth/password_recovery";
import profile from "../views/profile";
import user from "../views/otherUserProfile";
import auctions from "../views/auction_list";
import auction from "../views/auction_view";
import watching from "../views/watching";
import messages from "../views/messages";

export const routes = [
  { path: "/login", name: "Login", component: login },
  { path: "/register", name: "Registration", component: registration },
  { path: "/recovery", name: "Recovery", component: recovery },
  { path: "/auctions", name: "Checkout", component: auctions },
  { path: "/profile", name: "Profile", component: profile },
  { path: "/user/:id", name: "User", component: user, props: true },
  { path: "/auction", name: "Auction", component: auction },
  { path: "/watching", name: "Watching", component: watching },
  { path: "/messages", name: "Messages", component: messages },
  { path: "/logout", name: "Logout", component: login }
];
