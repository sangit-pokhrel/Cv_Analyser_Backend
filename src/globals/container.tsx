
const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-6xl mt-20 mx-auto px-4">
      {children}
    </div>
  )
}

export default Container;