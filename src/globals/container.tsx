
const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-7xl">
      {children}
    </div>
  )
}

export default Container;