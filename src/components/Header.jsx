import logo from "../assets/header-img.png";

export default function Header() {
  return (
    <header>
      <div className="bg-black p-2">
        <img src={logo} alt="logo" className="w-32 md:w-52" />
      </div>
    </header>
  );
}
