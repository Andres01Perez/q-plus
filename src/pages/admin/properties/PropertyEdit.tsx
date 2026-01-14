import { useParams, Navigate } from "react-router-dom";
import { PropertyForm } from "@/components/property/PropertyForm";

export default function PropertyEdit() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/admin/propiedades" replace />;
  }

  return (
    <div className="container max-w-5xl py-6">
      <PropertyForm propertyId={id} />
    </div>
  );
}
