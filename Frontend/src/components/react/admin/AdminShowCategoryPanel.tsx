import { useState, useEffect } from 'react';

// Definimos un tipo para nuestras categorías de funciones
interface ShowCategory {
  id: number;
  description: string;
  price: number;
}

const AdminShowCategoryPanel = () => {
  // --- Estados para la lista de categorías ---
  const [categories, setCategories] = useState<ShowCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Estados para el formulario ---
  const [newCategory, setNewCategory] = useState({ description: '', price: '' });

  // --- Estado para mensajes ---
  const [message, setMessage] = useState('');

  // --- Cargar categorías al montar el componente ---
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/showCategory');
      const data = await response.json();
      if (response.ok) {
        setCategories(data.data);
      }
    } catch (error) {
      setMessage('❌ Error al cargar las categorías.');
    } finally {
      setLoading(false);
    }
  };

  // --- Funciones para el formulario ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Creando categoría...');
    try {
      const res = await fetch('http://localhost:3000/api/showCategory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newCategory.description,
          price: parseFloat(newCategory.price)
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Categoría creada: ${data.data.description}`);
        fetchCategories(); // Recargar la lista
        setNewCategory({ description: '', price: '' }); // Limpiar formulario
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error de conexión con el backend.');
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      return;
    }
    setMessage(`Eliminando categoría ID: ${categoryId}...`);
    try {
      const res = await fetch(`http://localhost:3000/api/showCategory/${categoryId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessage('✅ Categoría eliminada correctamente.');
        fetchCategories(); // Recargar la lista
      } else {
        const data = await res.json();
        setMessage(`❌ Error al eliminar: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error de conexión con el backend.');
    }
  };


  return (
    <div style={{ color: 'black', maxWidth: '800px', margin: 'auto' }}>
      <h2>Gestionar Categorías de Funciones</h2>

      {/* Formulario para crear nueva categoría */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input type="text" name="description" value={newCategory.description} onChange={handleInputChange} placeholder="Descripción" required style={{ padding: '10px', color: 'black' }} />
        <input type="number" name="price" value={newCategory.price} onChange={handleInputChange} placeholder="Precio" required style={{ padding: '10px', color: 'black' }} />
        <button type="submit" style={{ padding: '10px 20px' }}>Crear</button>
      </form>

      {/* Lista de categorías existentes */}
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