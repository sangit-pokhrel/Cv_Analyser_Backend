import ProtectedRoute from "@/globals/protectedRoute";

const JobsByIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}
export default JobsByIdLayout ;