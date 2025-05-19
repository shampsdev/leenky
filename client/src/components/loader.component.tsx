const Loader = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div
        className="animate-spin rounded-full h-12 w-12 border-4 border-[#20C86E] border-t-transparent"
        style={{ animationDuration: "0.7s" }}
      />
    </div>
  );
};

export default Loader;
