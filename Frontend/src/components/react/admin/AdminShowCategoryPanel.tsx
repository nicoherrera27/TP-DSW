import { useState, useEffect } from 'react';
import { api } from '@/services/apiClient';

interface ShowCategory {
  id: number;
  description: string;
  price: number;
}

const AdminShowCategoryPanel = () => {
  const [categories, setCategories] = useState<ShowCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ description: '', price: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ data: ShowCategory[] }>('/api/showCategory');
      setCategories(response.data);
    } catch (error) {
      setMessage('❌ Error al cargar las categorías.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Creando categoría...');
    try {
      const data = await api.post<{ data: ShowCategory }>('/api/showCategory', {
        description: newCategory.description,
        price: parseFloat(newCategory.price)
      });
      setMessage(`✅ Categoría creada: ${data.data.description}`);
      fetchCategories();
      setNewCategory({ description: '', price: '' });
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return;
    setMessage(`Eliminando categoría ID: ${categoryId}...`);
    try {
      await api.delete(`/api/showCategory/${categoryId}`);
      setMessage('✅ Categoría eliminada correctamente.');
      fetchCategories();
    } catch (error: any) {
      setMessage(`❌ Error al eliminar: ${error.message}`);
    }
  };

  return (
    <div style={{ color: 'black', maxWidth: '800px', margin: 'auto' }}>
      <h2>Gestionar Categorías de Funciones</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input type="text" name="description" value={newCategory.description} onChange={handleInputChange} placeholder="Descripción" required style={{ padding: '10px', color: 'black' }} />
        <input type="number" name="price" value={newCategory.price} onChange={handleInputChange} placeholder="Precio" required style={{ padding: '10px', color: 'black' }} />
        <button type="submit" style={{ padding: '10px 20px' }}>Crear</button>
      </form>
      {loading ? <p>Cargando...</p> : (
        <div>
          {categories.map((category) => (
            <div key={category.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span>{category.description} - ${category.price}</span>
              <button onClick={() => handleDelete(category.id)} style={{ backgroundColor: '#dc3545', color: 'white' }}>Eliminar</button>
            </div>
          ))}
        </div>
      )}
      {message && <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
};

export default AdminShowCategoryPanel;