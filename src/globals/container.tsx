
const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-xl md:max-w-6xl mx-auto md:px-0 px-8 mt-10">
      {children}
    </div>
  )
}

export default Container;