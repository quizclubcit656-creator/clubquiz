import axios from 'axios';
import { Calendar, Check, ChevronDown, ChevronUp, Image as ImageIcon, LogOut, Mail, Monitor, Settings, Target, Users as TeamIcon, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [token, setToken] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('adminToken');
        const storedUser = localStorage.getItem('adminUser');
        if (!storedToken) {
            navigate('/admin');
        } else {
            setToken(storedToken);
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin');
    };

    const navItems = [
        { id: 'users', label: 'Admin Users', icon: Users },
        { id: 'pages', label: 'Page Content', icon: Settings },
        { id: 'banner', label: 'Middle Banner', icon: Monitor },
        { id: 'highlights', label: 'Highlights', icon: Target },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'achievements', label: 'Achievements', icon: Target },
        { id: 'gallery', label: 'Gallery', icon: ImageIcon },
        { id: 'team', label: 'Team Members', icon: TeamIcon },
        { id: 'contacts', label: 'Messages', icon: Mail },
    ];

    if (!token) return null;

    return (
        <div className="min-h-screen bg-admin-bg flex flex-col md:flex-row w-full">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-admin-sidebar border-b md:border-r border-gray-800 p-4 md:p-6 flex flex-col flex-shrink-0">
                <div className="flex justify-between items-center mb-4 md:mb-8 pl-1 md:pl-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gold">Admin Panel</h2>
                        <p className="text-gray-200 text-xs md:text-sm mt-1">Logged in as {currentUser?.username}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="md:hidden flex items-center p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                    </button>
                </div>

                <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto md:max-h-full space-x-2 md:space-x-0 md:space-y-2 pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col md:flex-row items-center md:justify-start justify-center space-y-1 md:space-y-0 md:space-x-3 px-3 py-2 md:px-4 md:py-3 rounded-lg transition-colors whitespace-nowrap min-w-[80px] md:min-w-0 md:w-full ${activeTab === item.id
                                ? 'bg-gold/10 text-gold border border-gold/20'
                                : 'text-gray-200 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={18} className="md:w-5 md:h-5" />
                            <span className="text-[10px] md:text-base">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="hidden md:flex mt-4 md:mt-auto items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors w-full"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow overflow-y-auto w-full">
                <div className="p-4 md:p-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-8 border-b border-gray-800 pb-2 md:pb-4">
                        {navItems.find(i => i.id === activeTab)?.label}
                    </h1>

                    {/* Content Component Rendering will go here */}
                    {activeTab === 'users' && <UsersManager token={token} />}
                    {activeTab === 'pages' && <PagesManager token={token} />}
                    {activeTab === 'banner' && <BannerManager token={token} />}
                    {activeTab === 'highlights' && <HighlightManager token={token} />}
                    {activeTab === 'events' && <GenericCrudManager endpoint="events" title="Events" columns={['title', 'date', 'imageUrl', 'time', 'venue', 'participants', 'description', 'googleFormUrl', 'isUpcoming']} token={token} />}
                    {activeTab === 'achievements' && <GenericCrudManager endpoint="achievements" title="Achievements" columns={['title', 'year', 'description', 'imageUrl']} token={token} />}
                    {activeTab === 'gallery' && <GenericCrudManager endpoint="gallery" title="Gallery" columns={['title', 'year', 'date', 'imageUrl', 'description', 'photos']} token={token} />}
                    {activeTab === 'team' && <GenericCrudManager endpoint="team" title="Team Members" columns={['image', 'name', 'role', 'year', 'department', 'category', 'order']} token={token} />}
                    {activeTab === 'contacts' && <ContactsViewer token={token} />}
                </div>
            </div>
        </div>
    );
};

// Generic CRUD Component matching multiple tables
const GenericCrudManager = ({ endpoint, title, columns, token }: { endpoint: string, title: string, columns: string[], token: string }) => {
    const [items, setItems] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Filtering states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const fetchItems = async () => {
        try {
            const res = await axios.get(`${API_URL}/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
            setItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [endpoint]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});

        // Simple URL validation for image fields
        const urlFields = ['imageUrl', 'image'];
        const errors: Record<string, string> = {};

        urlFields.forEach(field => {
            if (formData[field] && typeof formData[field] === 'string') {
                try {
                    // Check if it's a relative path starting with /uploads, /api, or a valid URL
                    const val = formData[field];
                    if (!val.startsWith('http') && !val.startsWith('/uploads') && !val.startsWith('/api') && !val.startsWith('data:')) {
                        new URL(val); // This will throw if invalid and not a relative path we allow
                    }
                } catch (_) {
                    errors[field] = 'Please enter a valid URL';
                }
            }
        });

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        let submitData = { ...formData };
        if (endpoint === 'gallery' && !submitData.year) {
            submitData.year = submitData.date ? new Date(submitData.date).getFullYear() : new Date().getFullYear();
        }

        try {
            if (editId) {
                await axios.put(`${API_URL}/${endpoint}/${editId}`, submitData, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await axios.post(`${API_URL}/${endpoint}`, submitData, { headers: { Authorization: `Bearer ${token}` } });
            }
            setModalOpen(false);
            setEditId(null);
            setFormData({});
            setFormErrors({});
            alert(`${title} ${editId ? 'updated' : 'added'} successfully`);
            fetchItems();
        } catch (err: any) {
            console.error('Full error:', err.response?.data || err.message);
            alert(`Error saving ${title}`);
        }
    };

    const handleEdit = (item: any) => {
        setFormData(item);
        setEditId(item._id);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this?')) return;
        try {
            await axios.delete(`${API_URL}/${endpoint}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchItems();
        } catch (err) {
            console.error(err);
        }
    };

    const renderRow = (item: any) => (
        <tr key={item._id} className="border-b border-gray-800 hover:bg-white/5">
            {columns.map((col) => (
                <td key={col} className="px-4 py-3 max-w-[200px] truncate" title={item[col] !== undefined ? String(item[col]) : ''}>
                    {col === 'photos' ? (
                        <span className="bg-gold/10 text-gold px-2 py-1 rounded text-xs font-bold">
                            {Array.isArray(item[col]) ? item[col].length : 0} items
                        </span>
                    ) : col === 'image' || col === 'imageUrl' ? (
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded bg-gray-800 border border-gray-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {item[col] ? (
                                    <img src={item[col]} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/40?text=Error')} />
                                ) : (
                                    <ImageIcon size={16} className="text-gray-400" />
                                )}
                            </div>
                            <span className="opacity-50 text-[10px]">{item[col] ? String(item[col]).slice(0, 15) + '...' : 'No Image'}</span>
                        </div>
                    ) : col === 'year' && endpoint === 'gallery' ? (
                        <span>{item[col] || (item.date ? new Date(item.date).getFullYear() : 'N/A')}</span>
                    ) : col === 'date' && item[col] ? (
                        <span>{new Date(item[col]).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    ) : col === 'description' && item[col] ? (
                        <span title={String(item[col])}>{String(item[col]).length > 50 ? String(item[col]).substring(0, 50) + '...' : String(item[col])}</span>
                    ) : typeof item[col] === 'boolean' ? (
                        item[col] ? 'Yes' : 'No'
                    ) : (
                        <span className={!item[col] ? 'opacity-30 italic' : ''}>
                            {item[col] || 'N/A'}
                        </span>
                    )}
                </td>
            ))}
            <td className="px-4 py-3 text-right whitespace-nowrap">
                <button onClick={() => handleEdit(item)} className="text-blue-400 hover:text-blue-300 mr-4">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="text-red-400 hover:text-red-300">Delete</button>
            </td>
        </tr>
    );

    const getFilteredItems = () => {
        return items.filter(item => {
            // Search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch = columns.some(col => {
                    const val = item[col];
                    if (val && typeof val === 'string' && val.toLowerCase().includes(searchLower)) return true;
                    if (val && typeof val === 'number' && val.toString().includes(searchLower)) return true;
                    return false;
                });
                if (!matchesSearch) return false;
            }

            // Category filter
            if (filterCategory && item.category !== filterCategory) {
                return false;
            }

            return true;
        });
    };

    const renderTableBody = () => {
        const filteredItems = getFilteredItems();

        if (endpoint === 'team') {
            const groupedItems = filteredItems.reduce((acc: any, item: any) => {
                const cat = item.category || 'Uncategorized';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(item);
                return acc;
            }, {});

            const categoryOrder = [
                'Staff Advisors',
                'Secretaries',
                'Joint Secretaries',
                'Treasurers',
                'Joint Treasurers',
                'Design Team',
                'Social Media Team',
                'Executive Directors',
                'Creative Directors',
                'Internal Affairs Team',
                'Outreach Ambassadors',
                'External Affairs Team',
                'Uncategorized'
            ];

            const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
                const aIdx = categoryOrder.indexOf(a);
                const bIdx = categoryOrder.indexOf(b);
                if (aIdx === -1) return 1;
                if (bIdx === -1) return -1;
                return aIdx - bIdx;
            });

            return sortedCategories.map(category => (
                <tbody key={`cat-${category}`}>
                    <tr className="bg-black/40 border-y border-gray-700">
                        <td colSpan={columns.length + 1} className="px-4 py-3 font-bold text-gold">
                            {category}
                        </td>
                    </tr>
                    {groupedItems[category]
                        .sort((a: any, b: any) => (a.order || Infinity) - (b.order || Infinity))
                        .map((item: any) => renderRow(item))}
                </tbody>
            ));
        }

        return (
            <tbody>
                {filteredItems.map((item) => renderRow(item))}
                {filteredItems.length === 0 && (
                    <tr>
                        <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-100">
                            No entries found.
                        </td>
                    </tr>
                )}
            </tbody>
        );
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-800 pb-4">
                <div>
                    <p className="text-gray-200">Manage all {title.toLowerCase()} here.</p>
                </div>
                <button
                    onClick={() => { setFormData({}); setEditId(null); setModalOpen(true); }}
                    className="bg-gold text-dark-primary px-4 py-2 font-bold rounded hover:bg-yellow-500 whitespace-nowrap"
                >
                    Add New
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-dark-secondary p-4 rounded-lg border border-gray-800">
                <input
                    type="text"
                    placeholder={`Search ${title.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow bg-dark-primary border border-gray-700 rounded p-2 text-white outline-none focus:border-gold"
                />

                {(endpoint === 'team' || columns.includes('category')) && (
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-dark-primary border border-gray-700 rounded p-2 text-white outline-none focus:border-gold"
                    >
                        <option value="">All Categories</option>
                        <option value="Staff Advisors">Staff Advisors</option>
                        <option value="Secretaries">Secretaries</option>
                        <option value="Joint Secretaries">Joint Secretaries</option>
                        <option value="Treasurers">Treasurers</option>
                        <option value="Joint Treasurers">Joint Treasurers</option>
                        <option value="Design Team">Design Team</option>
                        <option value="Social Media Team">Social Media Team</option>
                        <option value="Executive Directors">Executive Directors</option>
                        <option value="Creative Directors">Creative Directors</option>
                        <option value="Internal Affairs Team">Internal Affairs Team</option>
                        <option value="Outreach Ambassadors">Outreach Ambassadors</option>
                        <option value="External Affairs Team">External Affairs Team</option>
                    </select>
                )}
            </div>


            {fetching ? <p className="text-white">Loading...</p> : (
                <div className="overflow-x-auto bg-dark-secondary rounded-lg border border-gray-800">
                    <table className="w-full text-left text-gray-100 whitespace-nowrap">
                        <thead className="text-xs uppercase bg-black/20 text-gray-200">
                            <tr>
                                {columns.map((col) => (
                                    <th key={col} className="px-4 py-3 font-semibold">{col}</th>
                                ))}
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        {renderTableBody()}
                    </table>
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-secondary p-8 rounded-xl max-w-2xl w-full border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {editId ? `Edit ${title}` : `Add New ${title}`}
                        </h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            {columns.map((col) => (
                                <div key={col}>
                                    <label className="block text-gray-200 text-sm mb-1 capitalize">{col.replace(/([A-Z])/g, ' $1').trim()}</label>
                                    {(col === 'imageUrl' || col === 'image') ? (
                                        <div className="flex flex-col space-y-2">
                                            <input
                                                type="text"
                                                name={col}
                                                value={formData[col] || ''}
                                                onChange={handleChange}
                                                placeholder="Or enter image URL..."
                                                className={`w-full bg-dark-primary border ${formErrors[col] ? 'border-red-500' : 'border-gray-700'} rounded p-2 text-white outline-none focus:border-gold`}
                                            />
                                            {formErrors[col] && <p className="text-red-500 text-xs mt-1">{formErrors[col]}</p>}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const fData = new FormData();
                                                    fData.append('image', file);
                                                    try {
                                                        const res = await axios.post(`${API_URL}/upload`, fData, {
                                                            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
                                                        });
                                                        setFormData({ ...formData, [col]: res.data.imageUrl });
                                                    } catch (err) { alert('Upload failed'); console.error(err); }
                                                }}
                                                className="w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                                            />
                                            {formData[col] && (
                                                <div className="mt-4 flex flex-col items-center">
                                                    <p className="text-[10px] text-gray-100 uppercase mb-2">Preview</p>
                                                    <img
                                                        src={formData[col]}
                                                        alt="preview"
                                                        className={`object-cover border-2 border-purple-500/30 ${endpoint === 'team' || endpoint === 'teams' ? 'h-24 w-24 rounded-full' : 'h-24 w-40 rounded-xl'}`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : col === 'isUpcoming' ? (
                                        <select
                                            name={col}
                                            value={formData[col] === false ? 'false' : 'true'}
                                            onChange={(e) => setFormData({ ...formData, [col]: e.target.value === 'true' })}
                                            className="w-full bg-dark-primary border border-gray-700 rounded p-2 text-white"
                                        >
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>

                                    ) : col === 'description' ? (
                                        <textarea
                                            name={col}
                                            value={formData[col] || ''}
                                            onChange={handleChange}
                                            className="w-full bg-dark-primary border border-gray-700 rounded p-2 text-white h-24"
                                            required={endpoint !== 'team'}
                                        />
                                    ) : (col === 'category' && endpoint === 'team') ? (
                                        <select
                                            name={col}
                                            value={formData[col] || ''}
                                            onChange={handleChange}
                                            className="w-full bg-dark-primary border border-gray-700 rounded p-2 text-white"
                                            required
                                        >
                                            <option value="" disabled>Select category...</option>
                                            <option value="Staff Advisors">Staff Advisors</option>
                                            <option value="Secretaries">Secretaries</option>
                                            <option value="Joint Secretaries">Joint Secretaries</option>
                                            <option value="Treasurers">Treasurers</option>
                                            <option value="Joint Treasurers">Joint Treasurers</option>
                                            <option value="Design Team">Design Team</option>
                                            <option value="Social Media Team">Social Media Team</option>
                                            <option value="Executive Directors">Executive Directors</option>
                                            <option value="Creative Directors">Creative Directors</option>
                                            <option value="Internal Affairs Team">Internal Affairs Team</option>
                                            <option value="Outreach Ambassadors">Outreach Ambassadors</option>
                                            <option value="External Affairs Team">External Affairs Team</option>
                                        </select>
                                    ) : (col === 'department' && endpoint === 'team') ? (
                                        formData.category === 'Staff Advisors' ? (
                                            <input
                                                type="text"
                                                name={col}
                                                value={formData[col] || ''}
                                                onChange={handleChange}
                                                className="w-full bg-dark-primary border border-gray-700 rounded p-2 text-white"
                                                placeholder="e.g. Computer Science"
                                                required
                                            />
                                        ) : <div className="p-2 text-sm text-gray-100 italic">Only applicable for Staff Advisors</div>
                                    ) : (col === 'date' && (endpoint === 'events' || endpoint === 'gallery')) ? (
                                        <input
                                            type="date"
                                            name={col}
                                            value={formData[col] || ''}
                                            onChange={handleChange}
                                            className="w-full bg-dark-primary border border-gray-700 rounded p-2 text-white"
                                            required
                                        />
                                    ) : (col === 'year' && endpoint === 'gallery') ? (
                                        <input
                                            type="number"
                                            name={col}
                                            value={formData[col] || ''}
                                            placeholder="e.g. 2024"
                                            onChange={handleChange}
                                            className="w-full bg-dark-primary border border-gray-700 rounded p-2 text-white"
                                        />
                                    ) : (col === 'order') ? (
                                        <input
                                            type="number"
                                            name={col}
                                            value={formData[col] === undefined ? '' : formData[col]}
                                            onChange={(e) => setFormData({ ...formData, [col]: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-dark-primary border border-gray-700 rounded p-2 text-white"
                                            placeholder="e.g. 1 (lower numbers show first)"
                                        />
                                    ) : (col === 'photos' && endpoint === 'gallery') ? (
                                        <div className="space-y-4 bg-dark-secondary/30 p-4 rounded-xl border border-gray-800">

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-gray-100 uppercase tracking-widest">Or Upload Photo</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;

                                                        const fData = new FormData();
                                                        fData.append('image', file);
                                                        try {
                                                            const res = await axios.post(`${API_URL}/upload`, fData, {
                                                                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
                                                            });
                                                            const currentPhotos = formData.photos || [];
                                                            setFormData({ ...formData, photos: [...currentPhotos, res.data.imageUrl] });
                                                        } catch (err) {
                                                            alert('Upload failed');
                                                            console.error(err);
                                                        }
                                                    }}
                                                    className="w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                                                />
                                            </div>

                                            <div className="grid grid-cols-4 gap-3 pt-4 border-t border-gray-800">
                                                {(formData.photos || []).map((url: string, idx: number) => (
                                                    <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-700">
                                                        <img src={url} alt={`photo-${idx}`} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newPhotos = formData.photos.filter((_: any, i: number) => i !== idx);
                                                                setFormData({ ...formData, photos: newPhotos });
                                                            }}
                                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={16} className="text-white bg-red-500 rounded-full p-0.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            name={col}
                                            value={formData[col] || ''}
                                            onChange={handleChange}
                                            className="w-full bg-dark-primary border border-gray-700 rounded p-2 text-white"
                                            required={col !== 'github' && col !== 'linkedin' && col !== 'googleFormUrl' && col !== 'time' && col !== 'venue' && col !== 'participants' && col !== 'category' && col !== 'department' && col !== 'image' && col !== 'year'}
                                        />
                                    )}
                                </div>
                            ))}
                            <div className="flex justify-end space-x-4 pt-4 mt-6 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 text-gray-200 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gold text-dark-primary font-bold rounded hover:bg-yellow-500 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )}
        </div >
    );
};

// Users Manager Component
const UsersManager = ({ token }: { token: string }) => {
    // Basic implementation for managing admin users
    const [users, setUsers] = useState<any[]>([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/users`, { headers: { Authorization: `Bearer ${token}` } });
            setUsers(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/auth/users`, { username, password }, { headers: { Authorization: `Bearer ${token}` } });
            setUsername(''); setPassword('');
            fetchUsers();
        } catch (err: any) { alert(err.response?.data?.message || 'Error creating user'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this admin?')) return;
        try {
            await axios.delete(`${API_URL}/auth/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchUsers();
        } catch (err: any) { alert(err.response?.data?.message || 'Cannot delete'); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="bg-dark-secondary rounded-lg border border-gray-800 overflow-hidden">
                    <table className="w-full text-left text-gray-100">
                        <thead className="bg-black/20 text-gray-200">
                            <tr><th className="px-6 py-4">Username</th><th className="px-6 py-4">Role</th><th className="px-6 py-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} className="border-t border-gray-800">
                                    <td className="px-6 py-4">{u.username}</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-gold/10 text-gold rounded text-xs uppercase">{u.role}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(u._id)} className="text-red-400 hover:text-red-300">Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-dark-secondary p-6 rounded-lg border border-gray-800 h-fit">
                <h3 className="text-lg font-bold text-white mb-4">Create New Admin</h3>
                <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div>
                        <label className="text-gray-200 text-sm block mb-1">Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-dark-primary border border-gray-700 rounded p-2 text-white" required />
                    </div>
                    <div>
                        <label className="text-gray-200 text-sm block mb-1">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-dark-primary border border-gray-700 rounded p-2 text-white" required />
                    </div>
                    <button type="submit" className="w-full bg-gold text-dark-primary font-bold py-2 rounded">Create User</button>
                </form>
            </div>
        </div>
    );
};

// Pages Content Editor Component
const defaultHomeContent = {
    welcomePrefix: "Welcome to",
    clubName: "Quiz Club CIT",
    heroLine1: "Igniting minds through knowledge,",
    heroLine2: "fostering curiosity, and",
    heroLine3: "building champions",
    stats: [
        { icon: 'Trophy', title: 'Championship Winners', value: '15+', description: 'Inter-collegiate victories' },
        { icon: 'Brain', title: 'Knowledge Excellence', value: '500+', description: 'Questions mastered' },
        { icon: 'Users', title: 'Team Spirit', value: '100+', description: 'Active members' },
    ],
    highlightsHeading: "Latest Highlights",
    highlightsSubtitle: "Catch up on our recent events, achievements, and top moments.",
    benefitsHeading: "Why Join Quiz Club?",
    benefitsSubtitle: "Discover the benefits of being part of our vibrant community",
    benefits: [
        { icon: 'Target', title: 'Sharpen Your Mind', description: 'Develop critical thinking and rapid recall abilities through challenging quizzes.' },
        { icon: 'Users', title: 'Build Connections', description: 'Network with like-minded individuals and create lasting friendships.' },
        { icon: 'Trophy', title: 'Win Recognition', description: 'Compete at inter-collegiate levels and gain prestigious accolades.' },
    ]
};

const defaultAboutContent = {
    heroPrefix: "About",
    heroHighlight: "Us",
    heroSubtitle: "Quiz Club CIT is a vibrant community dedicated to promoting intellectual growth, fostering curiosity, and building champions through the art of quizzing.",
    aboutImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80",
    missionHeading: "Our Mission",
    mission: "To create an environment where students can explore diverse topics, enhance their general knowledge, and develop critical thinking skills through engaging quizzes and competitions. We strive to build a platform that celebrates learning and intellectual excellence.",
    visionHeading: "Our Vision",
    vision: "To become the leading quiz club in the region, recognized for nurturing intellectual curiosity and producing champions who excel not just in quizzing, but in all aspects of life. We envision a community where knowledge is celebrated and shared freely.",
    valuesHeading: "Our Values",
    values: [
        { icon: 'Heart', title: 'Passion for Learning', description: 'We believe in the joy of discovery and the thrill of learning something new every day.' },
        { icon: 'Zap', title: 'Excellence', description: 'We strive for excellence in everything we do, from organizing events to competing.' },
        { icon: 'Target', title: 'Integrity', description: 'We maintain the highest standards of fairness, honesty, and sportsmanship.' }
    ],
    storyHeading: "Our Story",
    story: [
        "Founded in 2015, Quiz Club CIT started as a small group of passionate students who shared a common love for knowledge and quizzing. What began as informal quiz sessions in classrooms has now grown into one of the most active and recognized clubs in the institution.",
        "Over the years, we've organized numerous inter-collegiate competitions, hosted renowned quizmasters, and participated in national-level tournaments. Our members have consistently brought laurels to the institution through their outstanding performances.",
        "Today, Quiz Club CIT stands as a testament to what dedication, teamwork, and a passion for learning can achieve. We continue to grow, innovate, and inspire the next generation of quizzers."
    ]
};

const PagesManager = ({ token }: { token: string }) => {
    const [pageName, setPageName] = useState('home');
    const [contentData, setContentData] = useState<any>({});
    const [logoUrl, setLogoUrl] = useState('');

    const fetchContent = async () => {
        try {
            const res = await axios.get(`${API_URL}/page-content/${pageName}`);
            const data = res.data || {};
            if (data.logoUrl !== undefined) {
                setLogoUrl(data.logoUrl);
                delete data.logoUrl;
            } else {
                setLogoUrl('');
            }

            // Merge with default template mapping
            const defaultTemplate = pageName === 'home' ? defaultHomeContent : pageName === 'about' ? defaultAboutContent : {};

            // Deep merge function could be complex, simple merge for top level
            // but for keys in data, overwrite default
            setContentData({ ...defaultTemplate, ...data });
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchContent(); }, [pageName]);

    const handleSave = async () => {
        try {
            const parsed = { ...contentData };
            if (logoUrl) parsed.logoUrl = logoUrl;
            await axios.post(`${API_URL}/page-content/${pageName}`, parsed, { headers: { Authorization: `Bearer ${token}` } });
            alert('Saved successfully');
        } catch (err) { alert('Error saving content'); }
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        const fData = new FormData();
        fData.append('image', file);
        try {
            const res = await axios.post(`${API_URL}/upload`, fData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
            });
            setLogoUrl(res.data.imageUrl);
            alert('Logo uploaded successfully. Click Save Context to apply.');
        } catch (err) { alert('Logo upload failed'); console.error(err); }
    }



    const renderDynamicEditor = (data: any, path: string[] = []) => {
        if (typeof data === 'string') {
            const currentKey = path[path.length - 1] || '';
            const isImage = currentKey.toLowerCase().includes('image') || currentKey.toLowerCase().includes('photo');

            if (isImage) {
                return (
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={data}
                            onChange={(e) => {
                                const newVal = e.target.value;
                                setContentData((prev: any) => {
                                    const clone = JSON.parse(JSON.stringify(prev));
                                    let curr = clone;
                                    for (let i = 0; i < path.length - 1; i++) curr = curr[path[i]];
                                    curr[path[path.length - 1]] = newVal;
                                    return clone;
                                });
                            }}
                            placeholder="Image URL"
                            className="w-full bg-dark-primary border border-gray-700 rounded p-3 text-white focus:border-gold outline-none"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const fData = new FormData();
                                fData.append('image', file);
                                try {
                                    const res = await axios.post(`${API_URL}/upload`, fData, {
                                        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
                                    });
                                    setContentData((prev: any) => {
                                        const clone = JSON.parse(JSON.stringify(prev));
                                        let curr = clone;
                                        for (let i = 0; i < path.length - 1; i++) curr = curr[path[i]];
                                        curr[path[path.length - 1]] = res.data.imageUrl;
                                        return clone;
                                    });
                                } catch (err) {
                                    alert('Image upload failed');
                                    console.error(err);
                                }
                            }}
                            className="w-full text-xs text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-gray-200 hover:file:bg-white/10"
                        />
                        {data && (data.startsWith('http') || data.startsWith('/')) && (
                            <img src={data} alt="Preview" className="h-32 object-contain bg-dark-primary border border-white/5 p-2 rounded-lg mt-2" />
                        )}
                    </div>
                );
            }

            const isLongText = currentKey.toLowerCase().includes('description') || currentKey.toLowerCase().includes('story') || currentKey.toLowerCase().includes('mission') || currentKey.toLowerCase().includes('vision') || data.length > 60 || data.includes('\n');

            if (!isLongText) {
                return (
                    <input
                        type="text"
                        value={data}
                        onChange={(e) => {
                            const newVal = e.target.value;
                            setContentData((prev: any) => {
                                const clone = JSON.parse(JSON.stringify(prev));
                                let curr = clone;
                                for (let i = 0; i < path.length - 1; i++) curr = curr[path[i]];
                                curr[path[path.length - 1]] = newVal;
                                return clone;
                            });
                        }}
                        className="w-full bg-dark-primary border border-gray-700 rounded p-3 text-white focus:border-gold outline-none focus:ring-1 focus:ring-gold/50 transition-all font-light"
                    />
                );
            }

            return (
                <textarea
                    value={data}
                    onChange={(e) => {
                        const newVal = e.target.value;
                        setContentData((prev: any) => {
                            const clone = JSON.parse(JSON.stringify(prev));
                            let curr = clone;
                            for (let i = 0; i < path.length - 1; i++) curr = curr[path[i]];
                            curr[path[path.length - 1]] = newVal;
                            return clone;
                        });
                    }}
                    className="w-full bg-dark-primary border border-gray-700 rounded p-3 text-white focus:border-gold outline-none min-h-[120px] focus:ring-1 focus:ring-gold/50 transition-all font-light resize-y"
                />
            );
        }

        if (Array.isArray(data)) {
            const isBenefits = path.length > 0 && path[path.length - 1] === 'benefits';
            return (
                <div className="space-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="bg-dark-primary/50 p-6 rounded-xl border border-white/5 relative group hover:border-white/10 transition-colors">
                            <span className="absolute -top-3 left-4 bg-dark-secondary px-3 py-0.5 rounded-full text-[10px] font-bold text-gold border border-gold/20 shadow-sm">Item {index + 1}</span>
                            {!isBenefits && (
                                <button
                                    onClick={() => {
                                        setContentData((prev: any) => {
                                            const clone = JSON.parse(JSON.stringify(prev));
                                            let curr = clone;
                                            for (let i = 0; i < path.length; i++) curr = curr[path[i]];
                                            curr.splice(index, 1);
                                            return clone;
                                        });
                                    }}
                                    className="absolute -right-2 -top-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 shadow-lg"
                                    title="Remove Item"
                                >
                                    <X size={14} />
                                </button>
                            )}
                            {renderDynamicEditor(item, [...path, index.toString()])}
                        </div>
                    ))}
                    {!isBenefits && (
                        <button
                            onClick={() => {
                                setContentData((prev: any) => {
                                    const clone = JSON.parse(JSON.stringify(prev));
                                    let curr = clone;
                                    for (let i = 0; i < path.length; i++) curr = curr[path[i]];
                                    curr.push(typeof curr[0] === 'string' ? '' : typeof curr[0] === 'object' ? {} : '');
                                    return clone;
                                });
                            }}
                            className="w-full py-4 bg-white/5 hover:bg-gold/10 text-gold rounded-xl font-bold border-2 border-dashed border-white/10 hover:border-gold/30 transition-all text-sm flex items-center justify-center gap-2 group"
                        >
                            <span className="text-xl group-hover:scale-125 transition-transform">+</span> Add New Item
                        </button>
                    )}
                </div>
            );
        }

        if (typeof data === 'object' && data !== null) {
            const keys = Object.keys(data).filter(k => k !== '_id' && k !== 'id');
            const primitives = keys.filter(k => typeof data[k] === 'string' || typeof data[k] === 'number' || typeof data[k] === 'boolean');
            const complex = keys.filter(k => typeof data[k] === 'object' && data[k] !== null);

            return (
                <div className="space-y-8">
                    {primitives.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-dark-secondary/40 p-6 md:p-8 rounded-2xl border border-gray-800/80 shadow-inner">
                            {primitives.map(key => {
                                const isLongText = key.toLowerCase().includes('description') || key.toLowerCase().includes('story') || key.toLowerCase().includes('mission') || key.toLowerCase().includes('vision') || (typeof data[key] === 'string' && data[key].length > 60) || key.toLowerCase().includes('image');
                                return (
                                    <div key={key} className={`flex flex-col ${isLongText ? 'md:col-span-2 lg:col-span-3' : ''}`}>
                                        <label className="text-gray-200 text-xs font-bold uppercase tracking-widest pl-1 mb-2.5 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold/50"></div>
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                        {renderDynamicEditor(data[key], [...path, key])}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {complex.length > 0 && (
                        <div className="space-y-6 lg:px-4">
                            {complex.map(key => (
                                <div key={key} className="bg-dark-secondary/60 p-6 md:p-8 rounded-2xl border border-gray-800 shadow-lg relative pt-10">
                                    <label className="absolute top-0 left-0 bg-gold text-dark-primary px-4 py-1.5 rounded-br-xl rounded-tl-xl text-xs font-black uppercase tracking-widest shadow-md">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </label>
                                    {renderDynamicEditor(data[key], [...path, key])}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return null; // fallback for numbers/booleans if needed
    };

    return (
        <div className="space-y-6">
            <div className="flex space-x-4 mb-4">
                {['home', 'about', 'members'].map(p => (
                    <button key={p} onClick={() => setPageName(p)} className={`px-4 py-2 rounded font-semibold capitalize ${pageName === p ? 'bg-gold text-dark-primary' : 'bg-dark-secondary text-gray-100'}`}>
                        {p}
                    </button>
                ))}
            </div>

            {pageName === 'home' && (
                <div className="bg-dark-secondary/10 border border-gray-800 p-6 rounded-lg mb-6 shadow-md">
                    <p className="text-gray-200 mb-2 font-semibold">Home Page Logo</p>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full text-xs text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-gray-200 hover:file:bg-white/10" />
                    {logoUrl && (
                        <div className="mt-4">
                            <p className="text-xs text-gray-200 mb-2 uppercase tracking-widest">Current Logo</p>
                            <img src={logoUrl} alt="Logo Preview" className="h-20 object-contain bg-dark-primary border border-white/10 p-3 rounded-lg shadow-inner" />
                        </div>
                    )}
                </div>
            )}

            <div className="bg-dark-secondary border border-gray-800 p-6 md:p-8 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                    <p className="text-gray-200 text-sm font-medium">Edit content visually below. Changes apply only after saving.</p>
                    <button onClick={handleSave} className="bg-gradient-to-r from-gold to-gold-dark text-dark-primary font-bold px-8 py-2.5 rounded-lg shadow-[0_0_15px_rgba(255, 215, 0, 0.6)] hover:shadow-[0_0_20px_rgba(255, 215, 0, 0.8)] transition-all transform hover:scale-105">
                        Save Changes
                    </button>
                </div>

                {Object.keys(contentData).length > 0 ? (
                    renderDynamicEditor(contentData)
                ) : (
                    <div className="py-12 text-center border border-dashed border-gray-800 rounded-xl">
                        <p className="text-gray-100">No editable dynamic content found for this page yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// Banner Manager Component
const BannerManager = ({ token }: { token: string }) => {
    const [slides, setSlides] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({ isActive: true, order: 0 });

    const fetchSlides = async () => {
        try {
            const res = await axios.get(`${API_URL}/banner/admin`, { headers: { Authorization: `Bearer ${token}` } });
            setSlides(res.data);
        } catch (err) { console.error(err); }
        finally { setFetching(false); }
    };

    useEffect(() => { fetchSlides(); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData({ ...formData, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`${API_URL}/banner/${editId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await axios.post(`${API_URL}/banner`, { ...formData, order: slides.length }, { headers: { Authorization: `Bearer ${token}` } });
            }
            setModalOpen(false);
            setEditId(null);
            setFormData({ isActive: true, order: 0 });
            fetchSlides();
        } catch (err) { console.error(err); }
    };

    const handleEdit = (slide: any) => {
        setFormData(slide);
        setEditId(slide._id);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this slide?')) return;
        try {
            await axios.delete(`${API_URL}/banner/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchSlides();
        } catch (err) { console.error(err); }
    };

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        const newSlides = [...slides];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= slides.length) return;

        [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];

        const orders = newSlides.map((s, i) => ({ id: s._id, order: i }));
        try {
            await axios.patch(`${API_URL}/banner/reorder`, { orders }, { headers: { Authorization: `Bearer ${token}` } });
            setSlides(newSlides);
        } catch (err) { console.error(err); }
    };

    const toggleActive = async (slide: any) => {
        try {
            await axios.put(`${API_URL}/banner/${slide._id}`, { ...slide, isActive: !slide.isActive }, { headers: { Authorization: `Bearer ${token}` } });
            fetchSlides();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <p className="text-gray-200">Manage home page banner slides.</p>
                <button onClick={() => { setFormData({ isActive: true, order: slides.length }); setEditId(null); setModalOpen(true); }} className="bg-gold text-dark-primary px-4 py-2 font-bold rounded hover:bg-yellow-500">
                    Add New Slide
                </button>
            </div>

            {fetching ? <p className="text-white">Loading...</p> : (
                <div className="grid grid-cols-1 gap-4">
                    {slides.map((slide, index) => (
                        <div key={slide._id} className="bg-dark-secondary border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-6 group">
                            <div className="w-full md:w-48 h-28 flex-shrink-0 bg-black rounded-lg overflow-hidden border border-gray-700 relative">
                                <img src={slide.image} alt="" className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[10px] text-white/50 uppercase tracking-widest">{slide.label}</span>
                                </div>
                            </div>

                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold text-white">{slide.title}</h3>
                                    {!slide.isActive && <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded border border-red-500/20">Inactive</span>}
                                </div>
                                <p className="text-gray-200 text-sm line-clamp-1">{slide.description}</p>
                                <div className="mt-2 flex gap-4 text-xs text-gray-100 items-center">
                                    <span className="bg-gray-800 px-2 py-1 rounded text-gold font-bold">Order: {slide.order}</span>
                                    <span>Button: {slide.buttonText || 'None'}</span>
                                    <span>Link: {slide.buttonLink || 'None'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 md:border-l border-gray-800 md:pl-6">
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-1 hover:bg-white/5 rounded disabled:opacity-20 text-gray-200"><ChevronUp size={20} /></button>
                                    <button onClick={() => handleMove(index, 'down')} disabled={index === slides.length - 1} className="p-1 hover:bg-white/5 rounded disabled:opacity-20 text-gray-200"><ChevronDown size={20} /></button>
                                </div>
                                <div className="h-10 w-[1px] bg-gray-800 mx-2 hidden md:block" />
                                <button onClick={() => toggleActive(slide)} title={slide.isActive ? 'Deactivate' : 'Activate'} className={`p-2 rounded-lg transition-colors ${slide.isActive ? 'text-green-400 hover:bg-green-400/10' : 'text-gray-100 hover:bg-white/5'}`}>
                                    {slide.isActive ? <Check size={20} /> : <X size={20} />}
                                </button>
                                <button onClick={() => handleEdit(slide)} className="px-3 py-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg text-sm transition-colors">Edit</button>
                                <button onClick={() => handleDelete(slide._id)} className="px-3 py-1.5 text-red-400 hover:bg-red-400/10 rounded-lg text-sm transition-colors">Delete</button>
                            </div>
                        </div>
                    ))}
                    {slides.length === 0 && <p className="text-center py-12 text-gray-100 border border-dashed border-gray-800 rounded-xl">No slides found. Add your first slide to get started.</p>}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-secondary p-8 rounded-2xl max-w-4xl w-full border border-gray-800 shadow-2xl max-h-[95vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{editId ? 'Edit Slide' : 'Add New Slide'}</h2>
                                <p className="text-gray-200 text-sm mt-1">Fill in the details for the banner slide.</p>
                            </div>
                            <button onClick={() => setModalOpen(false)} className="text-gray-100 hover:text-white"><X size={24} /></button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-gray-200 text-xs font-semibold uppercase tracking-wider mb-2">Image URL</label>
                                    <div className="flex flex-col gap-2">
                                        <input type="text" name="image" value={formData.image || ''} onChange={handleChange} placeholder="https://..." className="w-full bg-dark-primary border border-gray-700 rounded-lg p-3 text-white focus:border-gold outline-none transition-colors" required />
                                        <input type="file" accept="image/*" onChange={async (e) => {
                                            if (!e.target.files?.[0]) return;
                                            const fData = new FormData();
                                            fData.append('image', e.target.files[0]);
                                            try {
                                                const res = await axios.post(`${API_URL}/upload`, fData, {
                                                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
                                                });
                                                setFormData({ ...formData, image: res.data.imageUrl });
                                            } catch (err) { alert('Upload failed'); }
                                        }} className="text-xs text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/5 file:text-gray-200 hover:file:bg-white/10" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-gray-200 text-xs font-semibold uppercase tracking-wider mb-2">Order</label>
                                        <input type="number" name="order" value={formData.order || 0} onChange={handleChange} className="w-full bg-dark-primary border border-gray-700 rounded-lg p-3 text-white focus:border-gold outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-gray-200 text-xs font-semibold uppercase tracking-wider mb-2">Label</label>
                                        <input type="text" name="label" value={formData.label || ''} onChange={handleChange} placeholder="e.g. Knowledge Hub" className="w-full bg-dark-primary border border-gray-700 rounded-lg p-3 text-white focus:border-gold outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-200 text-xs font-semibold uppercase tracking-wider mb-2">Header</label>
                                        <input type="text" name="title" value={formData.title || ''} onChange={handleChange} placeholder="Main Title" className="w-full bg-dark-primary border border-gray-700 rounded-lg p-3 text-white focus:border-gold outline-none" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-200 text-xs font-semibold uppercase tracking-wider mb-2">Subtitle</label>
                                    <input type="text" name="subtitle" value={formData.subtitle || ''} onChange={handleChange} placeholder="Secondary Title" className="w-full bg-dark-primary border border-gray-700 rounded-lg p-3 text-white focus:border-gold outline-none" />
                                </div>

                                <div>
                                    <label className="block text-gray-200 text-xs font-semibold uppercase tracking-wider mb-2">Description</label>
                                    <textarea name="description" value={formData.description || ''} onChange={handleChange} className="w-full bg-dark-primary border border-gray-700 rounded-lg p-3 text-white focus:border-gold outline-none h-24 resize-none" required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-200 text-xs font-semibold uppercase tracking-wider mb-2">Button Text</label>
                                        <input type="text" name="buttonText" value={formData.buttonText || ''} onChange={handleChange} placeholder="Join Now" className="w-full bg-dark-primary border border-gray-700 rounded-lg p-3 text-white focus:border-gold outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-200 text-xs font-semibold uppercase tracking-wider mb-2">Button Link</label>
                                        <input type="text" name="buttonLink" value={formData.buttonLink || ''} onChange={handleChange} placeholder="/team" className="w-full bg-dark-primary border border-gray-700 rounded-lg p-3 text-white focus:border-gold outline-none" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 py-2">
                                    <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 accent-gold" />
                                    <label htmlFor="isActive" className="text-gray-100 text-sm">Active (Visible on site)</label>
                                </div>

                                <div className="flex gap-4 pt-6 border-t border-gray-800">
                                    <button type="button" onClick={() => setModalOpen(false)} className="flex-grow py-3 text-gray-200 hover:bg-white/5 rounded-lg font-bold transition-colors">Cancel</button>
                                    <button type="submit" className="flex-[2] py-3 bg-gold text-dark-primary font-bold rounded-lg hover:shadow-[0_0_20px_rgba(255, 215, 0, 0.7)] transition-all">Save Changes</button>
                                </div>
                            </form>

                            {/* Preview Section */}
                            <div className="hidden lg:block">
                                <label className="block text-gray-200 text-xs font-semibold uppercase tracking-wider mb-4">Live Preview</label>
                                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-inner">
                                    {formData.image && (
                                        <img src={formData.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                                    <div className="absolute inset-0 p-8 flex flex-col justify-center">
                                        {formData.label && <p className="text-gold text-[8px] uppercase tracking-[0.2em] font-medium mb-1">{formData.label}</p>}
                                        <h2 className="text-2xl font-bold text-white mb-1 leading-tight">{formData.title || 'Slide Title'}</h2>
                                        {formData.subtitle && <p className="text-sm text-white/80 font-medium mb-2">{formData.subtitle}</p>}
                                        <p className="text-gray-100 text-[10px] leading-relaxed mb-4 line-clamp-3">{formData.description || 'Slide description will appear here...'}</p>
                                        {formData.buttonText && (
                                            <div className="inline-block px-4 py-1.5 bg-gold text-dark-primary font-bold text-[10px] rounded-md">{formData.buttonText}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                    <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                                        <Monitor size={14} className="text-gold" />
                                        Display Check
                                    </h4>
                                    <ul className="text-[10px] text-gray-200 space-y-1.5">
                                        <li className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${formData.image ? 'bg-green-500' : 'bg-red-500'}`} />
                                            Background Image {formData.image ? 'Set' : 'Missing'}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${formData.title ? 'bg-green-500' : 'bg-red-500'}`} />
                                            Main Heading {formData.title ? 'Set' : 'Missing'}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                            Status: {formData.isActive ? 'Active (Live)' : 'Draft (Hidden)'}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ContactsViewer Component
const ContactsViewer = ({ token }: { token: string }) => {
    const [messages, setMessages] = useState<any[]>([]);

    const fetchMsgs = async () => {
        try {
            const res = await axios.get(`${API_URL}/contacts`, { headers: { Authorization: `Bearer ${token}` } });
            setMessages(res.data);
        } catch (err) { console.error(err); }
    }

    useEffect(() => {
        fetchMsgs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            await axios.delete(`${API_URL}/contacts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchMsgs();
        } catch (err) {
            console.error(err);
            alert('Failed to delete message');
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map(msg => (
                <div key={msg._id} className="bg-dark-secondary rounded-lg border border-gray-800 p-6 relative group">
                    <button
                        onClick={() => handleDelete(msg._id)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete Message"
                    >
                        <X size={20} />
                    </button>
                    <h3 className="text-white font-bold mb-1 pr-6">{msg.subject}</h3>
                    <p className="text-gold text-sm mb-4">{msg.name} ({msg.email})</p>
                    <p className="text-gray-100 text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-gray-100 text-xs mt-4">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>
            ))}
            {messages.length === 0 && <p className="text-gray-100">No messages found.</p>}
        </div>
    )
}

const HighlightCardEditor = ({ type, title, initialData, options, onSave }: any) => {
    const [data, setData] = useState(initialData);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const handleSave = () => {
        onSave(type, data);
    };

    return (
        <div className="bg-admin-card border border-gray-800 rounded-xl p-6 relative shadow-lg">
            {!data.isActive && <div className="absolute inset-0 bg-black/60 rounded-xl z-10 pointer-events-none backdrop-blur-[1px]"></div>}
            <div className="flex justify-between items-center mb-6 relative z-20">
                <h3 className="text-xl font-bold border-l-4 border-gold pl-3 text-white capitalize shrink-0">{title}</h3>
                <div className="flex items-center gap-3 bg-dark-primary px-3 py-1.5 rounded border border-gray-800 transition-colors hover:border-gray-700">
                    <label className={`text-xs font-bold uppercase tracking-widest cursor-pointer ${data.isActive ? 'text-gold' : 'text-gray-100'}`} htmlFor={`active-${type}`}>Visible</label>
                    <input id={`active-${type}`} type="checkbox" checked={data.isActive} onChange={(e) => { const nd = { ...data, isActive: e.target.checked }; setData(nd); onSave(type, nd); }} className="w-4 h-4 accent-gold cursor-pointer" />
                </div>
            </div>

            <div className="space-y-4 relative z-20">
                <div>
                    <label className="block text-gray-200 text-xs font-semibold uppercase tracking-wider mb-2">Pinned Item</label>
                    <div className="relative">
                        <select
                            value={data.pinnedId || ''}
                            onChange={(e) => { const nd = { ...data, pinnedId: e.target.value }; setData(nd); onSave(type, nd); }}
                            className="w-full bg-dark-primary border border-gray-700 rounded-lg p-3 text-white focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition-all cursor-pointer appearance-none"
                        >
                            <option value="">Latest (Auto-update)</option>
                            {options.map((opt: any) => (
                                <option key={opt._id} value={opt._id}>
                                    {type === 'member' ? opt.name : opt.title} {type === 'gallery' ? `(${opt.year})` : ''}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-4 text-gray-100 pointer-events-none" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-200 text-xs font-semibold uppercase tracking-wider mb-2">Badge Label</label>
                        <input type="text" value={data.badgeLabel || ''} onChange={(e) => setData({ ...data, badgeLabel: e.target.value })} onBlur={handleSave} placeholder="e.g. Upcoming" className="w-full bg-dark-primary border border-gray-700 rounded-lg p-3 text-white focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-gray-200 text-xs font-semibold uppercase tracking-wider mb-2">Button Text</label>
                        <input type="text" value={data.buttonText || ''} onChange={(e) => setData({ ...data, buttonText: e.target.value })} onBlur={handleSave} placeholder="e.g. View Details" className="w-full bg-dark-primary border border-gray-700 rounded-lg p-3 text-white focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition-all" />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-200 text-xs font-semibold uppercase tracking-wider mb-2 flex justify-between">
                        <span>Description Override</span>
                        <span className="text-gray-400 font-normal normal-case tracking-normal">Leave blank for original</span>
                    </label>
                    <textarea value={data.descriptionOverride || ''} onChange={(e) => setData({ ...data, descriptionOverride: e.target.value })} onBlur={handleSave} placeholder="Custom description text..." className="w-full bg-dark-primary border border-gray-700 rounded-lg p-3 text-white h-20 resize-none focus:border-gold focus:ring-1 focus:ring-gold/50 outline-none transition-all" />
                </div>
            </div>
        </div>
    );
};

// Highlight Manager Component
const HighlightManager = ({ token }: { token: string }) => {
    const [highlights, setHighlights] = useState<any[]>([]);
    const [options, setOptions] = useState<any>({ event: [], gallery: [], achievement: [], member: [] });
    const [fetching, setFetching] = useState(true);

    const fetchHighlights = async () => {
        try {
            const res = await axios.get(`${API_URL}/highlights`);
            setHighlights(res.data);

            const types = ['event', 'gallery', 'achievement', 'member'];
            const opts: any = {};
            for (let t of types) {
                const optRes = await axios.get(`${API_URL}/highlights/options/${t}`, { headers: { Authorization: `Bearer ${token}` } });
                opts[t] = optRes.data;
            }
            setOptions(opts);
        } catch (err) { console.error(err); }
        finally { setFetching(false); }
    };

    useEffect(() => { fetchHighlights(); }, []);

    const handleSave = async (type: string, data: any) => {
        try {
            await axios.put(`${API_URL}/highlights/${type}`, data, { headers: { Authorization: `Bearer ${token}` } });
            // Let optimistic UI stay; fetch if needed but optimistic is enough for UX since options don't change
        } catch (err) { alert('Error saving highlight'); }
    };

    const getHl = (type: string) => highlights.find(h => h.type === type) || { type, isActive: true, badgeLabel: '', buttonText: '', descriptionOverride: '', pinnedId: '' };

    return (
        <div className="space-y-8">
            <div className="bg-admin-card border border-gray-800 p-6 rounded-2xl flex items-start md:items-center justify-between shadow-xl flex-col md:flex-row gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        <Target className="text-gold" /> Latest Highlights
                    </h2>
                    <p className="text-gray-200 text-sm">Manage the 4 pinned items on the Homepage Highlights section. Form saves automatically on change or blur.</p>
                </div>
            </div>

            {fetching ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-pulse">
                    {[1, 2, 3, 4].map(i => <div key={i} className="bg-admin-card/50 h-64 rounded-xl border border-white/5" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                    <HighlightCardEditor type="event" title="Event Highlight" initialData={getHl('event')} options={options.event || []} onSave={handleSave} />
                    <HighlightCardEditor type="gallery" title="Gallery Highlight" initialData={getHl('gallery')} options={options.gallery || []} onSave={handleSave} />
                    <HighlightCardEditor type="achievement" title="Achievement Highlight" initialData={getHl('achievement')} options={options.achievement || []} onSave={handleSave} />
                    <HighlightCardEditor type="member" title="Featured Member" initialData={getHl('member')} options={options.member || []} onSave={handleSave} />
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
