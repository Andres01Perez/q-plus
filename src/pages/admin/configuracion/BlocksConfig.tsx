import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlocksConfig } from "@/hooks/useBlocksConfig";
import BlockForm from "./BlockForm";
import AttributeForm from "./AttributeForm";
import type { BlockWithAttributes, Attribute } from "@/types/property";

function getIconComponent(iconName: string | null): React.ComponentType<{ className?: string }> | null {
  if (!iconName) return null;
  const pascalCase = iconName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return icons[pascalCase] || null;
}

const BLOCK_TYPE_LABELS: Record<string, string> = {
  checklist: "Lista de verificación",
  details_list: "Lista de detalles",
  free_text: "Texto libre",
};

const INPUT_TYPE_LABELS: Record<string, string> = {
  checkbox: "Checkbox",
  text: "Texto",
  number: "Número",
  textarea: "Textarea",
};

export default function BlocksConfig() {
  const {
    blocks,
    isLoading,
    createBlock,
    updateBlock,
    deleteBlock,
    createAttribute,
    updateAttribute,
    deleteAttribute,
  } = useBlocksConfig();

  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>({});
  const [blockFormOpen, setBlockFormOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<BlockWithAttributes | null>(null);
  const [attributeFormOpen, setAttributeFormOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedBlockName, setSelectedBlockName] = useState<string>("");
  const [deleteBlockDialog, setDeleteBlockDialog] = useState<{ open: boolean; block: BlockWithAttributes | null }>({
    open: false,
    block: null,
  });
  const [deleteAttrDialog, setDeleteAttrDialog] = useState<{ open: boolean; attr: Attribute | null }>({
    open: false,
    attr: null,
  });

  const toggleBlock = (blockId: string) => {
    setOpenBlocks((prev) => ({
      ...prev,
      [blockId]: !prev[blockId],
    }));
  };

  const handleCreateBlock = () => {
    setEditingBlock(null);
    setBlockFormOpen(true);
  };

  const handleEditBlock = (block: BlockWithAttributes) => {
    setEditingBlock(block);
    setBlockFormOpen(true);
  };

  const handleDeleteBlock = async () => {
    if (deleteBlockDialog.block) {
      await deleteBlock(deleteBlockDialog.block.id, deleteBlockDialog.block.name);
      setDeleteBlockDialog({ open: false, block: null });
    }
  };

  const handleCreateAttribute = (block: BlockWithAttributes) => {
    setEditingAttribute(null);
    setSelectedBlockId(block.id);
    setSelectedBlockName(block.name);
    setAttributeFormOpen(true);
  };

  const handleEditAttribute = (attr: Attribute, blockName: string) => {
    setEditingAttribute(attr);
    setSelectedBlockId(attr.block_id);
    setSelectedBlockName(blockName);
    setAttributeFormOpen(true);
  };

  const handleDeleteAttribute = async () => {
    if (deleteAttrDialog.attr) {
      await deleteAttribute(deleteAttrDialog.attr.id, deleteAttrDialog.attr.name);
      setDeleteAttrDialog({ open: false, attr: null });
    }
  };

  const handleBlockSubmit = async (data: Parameters<typeof createBlock>[0]) => {
    if (editingBlock) {
      return await updateBlock(editingBlock.id, data);
    } else {
      return await createBlock(data);
    }
  };

  const handleAttributeSubmit = async (data: Parameters<typeof createAttribute>[1]) => {
    if (editingAttribute) {
      return await updateAttribute(editingAttribute.id, data);
    } else if (selectedBlockId) {
      return await createAttribute(selectedBlockId, data);
    }
    return false;
  };

  const getNextBlockOrder = () => {
    if (blocks.length === 0) return 0;
    return Math.max(...blocks.map((b) => b.display_order ?? 0)) + 1;
  };

  const getNextAttributeOrder = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block || block.attributes.length === 0) return 0;
    return Math.max(...block.attributes.map((a) => a.display_order ?? 0)) + 1;
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-8 w-48 sm:w-64" />
            <Skeleton className="h-10 w-full sm:w-36" />
          </div>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-foreground truncate">
              Configuración de Bloques
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              Administra los bloques y atributos dinámicos
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button onClick={handleCreateBlock} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo bloque
            </Button>
          </div>
        </div>

        {blocks.length === 0 ? (
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center py-12 px-4">
              <div className="rounded-full bg-muted p-4 mb-4">
                <LucideIcons.LayoutGrid className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-center">No hay bloques</h3>
              <p className="text-muted-foreground text-center mb-4 text-sm sm:text-base">
                Crea tu primer bloque para empezar a configurar los atributos de las propiedades
              </p>
              <Button onClick={handleCreateBlock}>
                <Plus className="h-4 w-4 mr-2" />
                Crear bloque
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {blocks.map((block) => {
              const IconComponent = getIconComponent(block.icon);
              const isOpen = openBlocks[block.id] ?? false;

              return (
                <Card key={block.id} className={`overflow-hidden ${!block.is_active ? "opacity-60" : ""}`}>
                  <Collapsible open={isOpen} onOpenChange={() => toggleBlock(block.id)}>
                    <CardHeader className="pb-3 px-3 sm:px-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        {/* Trigger - full width on mobile */}
                        <CollapsibleTrigger asChild>
                          <button className="flex items-center gap-2 sm:gap-3 text-left hover:opacity-80 transition-opacity w-full sm:w-auto min-w-0">
                            <GripVertical className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                            {isOpen ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                            {IconComponent && (
                              <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <CardTitle className="text-base sm:text-lg truncate">{block.name}</CardTitle>
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {BLOCK_TYPE_LABELS[block.type] || block.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {block.attributes.length} atributo{block.attributes.length !== 1 ? "s" : ""}
                                </span>
                                {!block.is_active && (
                                  <Badge variant="secondary" className="text-xs">
                                    Inactivo
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </button>
                        </CollapsibleTrigger>
                        
                        {/* Action buttons - aligned right, symmetric */}
                        <div className="flex items-center justify-end gap-2 flex-shrink-0 ml-auto sm:ml-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => handleEditBlock(block)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => setDeleteBlockDialog({ open: true, block })}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CollapsibleContent>
                      <CardContent className="pt-0 px-3 sm:px-6">
                        <div className="border rounded-lg divide-y overflow-hidden">
                          {block.attributes.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                              Este bloque no tiene atributos
                            </div>
                          ) : (
                            block.attributes.map((attr) => (
                              <div
                                key={attr.id}
                                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-3 hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                  <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-sm truncate">{attr.name}</p>
                                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                      <span className="text-xs text-muted-foreground">
                                        {INPUT_TYPE_LABELS[attr.input_type] || attr.input_type}
                                      </span>
                                      {attr.is_required && (
                                        <Badge variant="secondary" className="text-xs">
                                          Requerido
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Attribute action buttons - symmetric */}
                                <div className="flex items-center justify-end gap-1 flex-shrink-0 ml-6 sm:ml-0">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleEditAttribute(attr, block.name)}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setDeleteAttrDialog({ open: true, attr })}
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                          <div className="p-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-muted-foreground hover:text-foreground"
                              onClick={() => handleCreateAttribute(block)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Agregar atributo
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Block Form Modal */}
      <BlockForm
        open={blockFormOpen}
        onOpenChange={setBlockFormOpen}
        block={editingBlock}
        onSubmit={handleBlockSubmit}
        nextOrder={getNextBlockOrder()}
      />

      {/* Attribute Form Modal */}
      <AttributeForm
        open={attributeFormOpen}
        onOpenChange={setAttributeFormOpen}
        attribute={editingAttribute}
        blockName={selectedBlockName}
        onSubmit={handleAttributeSubmit}
        nextOrder={selectedBlockId ? getNextAttributeOrder(selectedBlockId) : 0}
      />

      {/* Delete Block Dialog */}
      <AlertDialog
        open={deleteBlockDialog.open}
        onOpenChange={(open) => setDeleteBlockDialog({ open, block: deleteBlockDialog.block })}
      >
        <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar bloque?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar el bloque "{deleteBlockDialog.block?.name}"?
              <br />
              <br />
              <strong>Esta acción eliminará:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{deleteBlockDialog.block?.attributes.length || 0} atributo(s) asociados</li>
                <li>Todos los valores guardados en las propiedades</li>
              </ul>
              <br />
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBlock}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar bloque
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Attribute Dialog */}
      <AlertDialog
        open={deleteAttrDialog.open}
        onOpenChange={(open) => setDeleteAttrDialog({ open, attr: deleteAttrDialog.attr })}
      >
        <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar atributo?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar el atributo "{deleteAttrDialog.attr?.name}"?
              <br />
              <br />
              Los valores de este atributo se eliminarán de todas las propiedades.
              <br />
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAttribute}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar atributo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
