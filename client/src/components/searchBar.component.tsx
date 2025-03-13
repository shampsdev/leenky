import SearchIcon from "../assets/search_transparent.svg";
interface SearchBarProps {
  inputHandler: (value: string) => void;
  placeholder: string;
}
const SearchBarComponent = (props: SearchBarProps) => {
  const closeKeyboard = (event: React.KeyboardEvent) => {
    if (event.target instanceof HTMLElement) {
      event.target.blur();
    }
  };

  return (
    <div className="relative flex items-center gap-[8px] bg-[#EEEEEF] rounded-lg px-3 py-2 mb-4">
      <button>
        <img src={SearchIcon} alt="search" className="w-5 h-5" />
      </button>
      <input
        onKeyDown={closeKeyboard}
        onInput={(event: any) => props.inputHandler(event.target.value)}
        type="text"
        placeholder={props.placeholder}
        className="flex-1 outline-none placeholder-[#838388] text-main"
      />
    </div>
  );
};

export default SearchBarComponent;
