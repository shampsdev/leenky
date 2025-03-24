import SearchIcon from "../assets/search_transparent.svg";

interface SearchBarProps {
  value: string;
  inputHandler: (value: string) => void;
  placeholder: string;
  className?: string;
}

const SearchBarComponent = ({
  value,
  inputHandler,
  placeholder,
  className,
}: SearchBarProps) => {
  const closeKeyboard = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
  };

  return (
    <div
      className={`relative flex items-center gap-[8px] bg-[#EEEEEF] rounded-lg px-3 py-2 ${className}`}
    >
      <button>
        <img src={SearchIcon} alt="search" className="w-5 h-5" />
      </button>
      <input
        type="text"
        value={value}
        onKeyDown={closeKeyboard}
        onChange={(event) => inputHandler(event.target.value)}
        placeholder={placeholder}
        className="flex-1 outline-none placeholder-[#838388] text-main"
      />
    </div>
  );
};

export default SearchBarComponent;
