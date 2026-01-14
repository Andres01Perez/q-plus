import { useParams, Navigate } from "react-router-dom";
import { PropertyForm } from "@/components/property/PropertyForm";

export default function PropertyEdit() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/admin/propiedades" replace />;
  }

  return <PropertyForm propertyId={id} />;
}
