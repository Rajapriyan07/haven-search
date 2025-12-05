import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Plus, Pencil, Trash2, ArrowLeft, Upload, ImageIcon, X, Video, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  area: string;
  type: string;
  image_url: string | null;
  images: string[] | null;
  videos: string[] | null;
  badge: string | null;
  description: string | null;
  featured: boolean | null;
}

interface FormData {
  title: string;
  location: string;
  price: string;
  area: string;
  type: string;
  image_url: string;
  images: string[];
  videos: string[];
  badge: string;
  description: string;
  featured: boolean;
}

const emptyProperty: FormData = {
  title: '',
  location: '',
  price: '',
  area: '',
  type: '',
  image_url: '',
  images: [],
  videos: [],
  badge: '',
  description: '',
  featured: false,
};

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyProperty);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const { data: properties, isLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Property[];
    },
    enabled: !!user,
  });

  // Fetch view counts for all properties
  const { data: viewCounts } = useQuery({
    queryKey: ['property-view-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_views')
        .select('property_id');
      if (error) throw error;
      
      // Count views per property
      const counts: Record<string, number> = {};
      data?.forEach((view) => {
        counts[view.property_id] = (counts[view.property_id] || 0) + 1;
      });
      return counts;
    },
    enabled: !!user && isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { error } = await supabase.from('properties').insert([{
        ...data,
        image_url: data.images[0] || data.image_url || null,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['featured-properties'] });
      toast({ title: 'Success', description: 'Property created successfully' });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const { error } = await supabase.from('properties').update({
        ...data,
        image_url: data.images[0] || data.image_url || null,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['featured-properties'] });
      toast({ title: 'Success', description: 'Property updated successfully' });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['featured-properties'] });
      toast({ title: 'Success', description: 'Property deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProperty(null);
    setFormData(emptyProperty);
  };

  const openEditDialog = (property: Property) => {
    setEditingProperty(property);
    const existingImages = property.images || [];
    // If no images in array but there's an image_url, use that
    const images = existingImages.length > 0 
      ? existingImages 
      : (property.image_url ? [property.image_url] : []);
    
    setFormData({
      title: property.title,
      location: property.location,
      price: property.price,
      area: property.area,
      type: property.type,
      image_url: property.image_url || '',
      images: images,
      videos: property.videos || [],
      badge: property.badge || '',
      description: property.description || '',
      featured: property.featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({ title: 'Error', description: `${file.name} is not an image file`, variant: 'destructive' });
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({ title: 'Error', description: `${file.name} is larger than 5MB`, variant: 'destructive' });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `property-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) {
          toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({ 
          ...prev, 
          images: [...prev.images, ...uploadedUrls] 
        }));
        toast({ title: 'Success', description: `${uploadedUrls.length} image(s) uploaded successfully` });
      }
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingVideo(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('video/')) {
          toast({ title: 'Error', description: `${file.name} is not a video file`, variant: 'destructive' });
          continue;
        }

        // Validate file size (max 50MB for videos)
        if (file.size > 50 * 1024 * 1024) {
          toast({ title: 'Error', description: `${file.name} is larger than 50MB`, variant: 'destructive' });
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `property-videos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, file);

        if (uploadError) {
          toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({ 
          ...prev, 
          videos: [...prev.videos, ...uploadedUrls] 
        }));
        toast({ title: 'Success', description: `${uploadedUrls.length} video(s) uploaded successfully` });
      }
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProperty) {
      updateMutation.mutate({ id: editingProperty.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You don't have admin privileges.</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Admin Panel</span>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" onClick={() => { setEditingProperty(null); setFormData(emptyProperty); }}>
                <Plus className="h-4 w-4 mr-2" /> Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProperty ? 'Edit Property' : 'Add New Property'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area *</Label>
                    <Input
                      id="area"
                      required
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Input
                      id="type"
                      required
                      placeholder="Residential, Commercial, Land"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="badge">Badge</Label>
                    <Input
                      id="badge"
                      placeholder="New, Featured, etc."
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Property Images</Label>
                  <div className="space-y-3">
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((url, index) => (
                          <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-border">
                            <img 
                              src={url} 
                              alt={`Property image ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div 
                      className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload images</p>
                      <p className="text-xs text-muted-foreground">You can select multiple images</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload from Gallery'}
                    </Button>
                  </div>
                </div>
                {/* Video Upload Section */}
                <div className="space-y-2">
                  <Label>Property Videos</Label>
                  <div className="space-y-3">
                    {formData.videos.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {formData.videos.map((url, index) => (
                          <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-border">
                            <video 
                              src={url} 
                              className="w-full h-full object-cover"
                              controls
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => removeVideo(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div 
                      className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() => videoInputRef.current?.click()}
                    >
                      <Video className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload videos</p>
                      <p className="text-xs text-muted-foreground">Max 50MB per video</p>
                    </div>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      multiple
                      className="hidden"
                      onChange={handleVideoUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={uploadingVideo}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingVideo ? 'Uploading Video...' : 'Upload Video'}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="featured">Featured Property</Label>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={closeDialog}>Cancel</Button>
                  <Button type="submit" variant="hero">
                    {editingProperty ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Properties ({properties?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading properties...</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties?.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell>
                          {(property.images && property.images.length > 0) || property.image_url ? (
                            <div className="relative w-16 h-12 rounded overflow-hidden">
                              <img 
                                src={property.images?.[0] || property.image_url || ''} 
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                              {property.images && property.images.length > 1 && (
                                <span className="absolute bottom-0 right-0 bg-background/80 text-xs px-1 rounded-tl">
                                  +{property.images.length - 1}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{property.title}</TableCell>
                        <TableCell>{property.location}</TableCell>
                        <TableCell>{property.price}</TableCell>
                        <TableCell>{property.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>{viewCounts?.[property.id] || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>{property.featured ? 'Yes' : 'No'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(property)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => deleteMutation.mutate(property.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;