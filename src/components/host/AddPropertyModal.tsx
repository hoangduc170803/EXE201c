import React, { useState, useEffect } from 'react';
import { api, CategoryDto, AmenityDto } from '@/services/api';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [amenities, setAmenities] = useState<AmenityDto[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'APARTMENT',
    address: '',
    city: '',
    state: '',
    country: 'Vietnam',
    zipCode: '',
    pricePerNight: 0,
    cleaningFee: 0,
    serviceFee: 0,
    maxGuests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    areaSqft: 0,
    minNights: 1,
    maxNights: 365,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    houseRules: '',
    cancellationPolicy: 'FLEXIBLE',
    isInstantBook: false,
    categoryId: undefined as number | undefined,
    amenityIds: [] as number[],
    images: [] as Array<{ imageUrl: string; caption: string; displayOrder: number; isPrimary: boolean }>,
  });

  useEffect(() => {
    if (isOpen) {
      loadCategoriesAndAmenities();
    }
  }, [isOpen]);

  const loadCategoriesAndAmenities = async () => {
    try {
      const [categoriesRes, amenitiesRes] = await Promise.all([
        api.getCategories(),
        api.getAmenities(),
      ]);
      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (amenitiesRes.success) setAmenities(amenitiesRes.data);
    } catch (error) {
      console.error('Failed to load categories/amenities:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number.parseFloat(value) || 0 : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAmenityToggle = (amenityId: number) => {
    setFormData(prev => ({
      ...prev,
      amenityIds: prev.amenityIds.includes(amenityId)
        ? prev.amenityIds.filter(id => id !== amenityId)
        : [...prev.amenityIds, amenityId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.createProperty(formData);
      if (response.success) {
        onSuccess();
        onClose();
        resetForm();
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      title: '',
      description: '',
      propertyType: 'APARTMENT',
      address: '',
      city: '',
      state: '',
      country: 'Vietnam',
      zipCode: '',
      pricePerNight: 0,
      cleaningFee: 0,
      serviceFee: 0,
      maxGuests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      areaSqft: 0,
      minNights: 1,
      maxNights: 365,
      checkInTime: '14:00',
      checkOutTime: '11:00',
      houseRules: '',
      cancellationPolicy: 'FLEXIBLE',
      isInstantBook: false,
      categoryId: undefined,
      amenityIds: [],
      images: [],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a2632] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Property</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Step {step} of 4</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Basic Information</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  maxLength={200}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Cozy Studio in District 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Describe your property..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="APARTMENT">Apartment</option>
                    <option value="HOUSE">House</option>
                    <option value="VILLA">Villa</option>
                    <option value="CONDO">Condo</option>
                    <option value="TOWNHOUSE">Townhouse</option>
                    <option value="STUDIO">Studio</option>
                    <option value="PENTHOUSE">Penthouse</option>
                    <option value="LOFT">Loft</option>
                    <option value="COTTAGE">Cottage</option>
                    <option value="CABIN">Cabin</option>
                    <option value="FARMHOUSE">Farmhouse</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value ? Number(e.target.value) : undefined }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Postal/Zip code"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Property Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Price per Night (VND) *
                  </label>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Cleaning Fee (VND)
                  </label>
                  <input
                    type="number"
                    name="cleaningFee"
                    value={formData.cleaningFee}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Max Guests *
                  </label>
                  <input
                    type="number"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Beds
                  </label>
                  <input
                    type="number"
                    name="beds"
                    value={formData.beds}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Min Nights
                  </label>
                  <input
                    type="number"
                    name="minNights"
                    value={formData.minNights}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Max Nights
                  </label>
                  <input
                    type="number"
                    name="maxNights"
                    value={formData.maxNights}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Check-in Time
                  </label>
                  <input
                    type="time"
                    name="checkInTime"
                    value={formData.checkInTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={formData.checkOutTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Cancellation Policy
                </label>
                <select
                  name="cancellationPolicy"
                  value={formData.cancellationPolicy}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="FLEXIBLE">Flexible</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="STRICT">Strict</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isInstantBook"
                  name="isInstantBook"
                  checked={formData.isInstantBook}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isInstantBook" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  Enable instant booking
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Amenities & Rules</h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Select Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                  {amenities.map(amenity => (
                    <label
                      key={amenity.id}
                      className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenityIds.includes(amenity.id)}
                        onChange={() => handleAmenityToggle(amenity.id)}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <span className="material-symbols-outlined text-[18px] text-slate-600 dark:text-slate-400">
                        {amenity.icon}
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{amenity.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  House Rules
                </label>
                <textarea
                  name="houseRules"
                  value={formData.houseRules}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., No smoking, No pets, No parties..."
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Property Images</h3>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[24px]">info</span>
                  <div className="flex-1">
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">Add Images via URL</p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      Currently, you can add images by providing image URLs. Upload from device will be available soon.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Property Images {formData.images.length > 0 && `(${formData.images.length})`}
                </label>

                {/* Image List */}
                <div className="space-y-3 mb-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex-shrink-0 w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                        {image.imageUrl ? (
                          <img src={image.imageUrl} alt={image.caption} className="w-full h-full object-cover" onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Invalid';
                          }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-400 text-[32px]">image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <input
                          type="url"
                          placeholder="Image URL"
                          value={image.imageUrl}
                          onChange={(e) => {
                            const newImages = [...formData.images];
                            newImages[index].imageUrl = e.target.value;
                            setFormData(prev => ({ ...prev, images: newImages }));
                          }}
                          className="w-full px-3 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white mb-2"
                        />
                        <input
                          type="text"
                          placeholder="Caption (optional)"
                          value={image.caption}
                          onChange={(e) => {
                            const newImages = [...formData.images];
                            newImages[index].caption = e.target.value;
                            setFormData(prev => ({ ...prev, images: newImages }));
                          }}
                          className="w-full px-3 py-1.5 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <label className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={image.isPrimary}
                              onChange={(e) => {
                                const newImages = formData.images.map((img, i) => ({
                                  ...img,
                                  isPrimary: i === index ? e.target.checked : false
                                }));
                                setFormData(prev => ({ ...prev, images: newImages }));
                              }}
                              className="w-3 h-3 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            Primary Image
                          </label>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          // Reorder displayOrder
                          newImages.forEach((img, i) => img.displayOrder = i);
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }}
                        className="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Image Button */}
                <button
                  type="button"
                  onClick={() => {
                    const newImage = {
                      imageUrl: '',
                      caption: '',
                      displayOrder: formData.images.length,
                      isPrimary: formData.images.length === 0
                    };
                    setFormData(prev => ({ ...prev, images: [...prev.images, newImage] }));
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <span className="material-symbols-outlined text-[24px]">add_photo_alternate</span>
                  <span className="font-medium">Add Image URL</span>
                </button>

                {formData.images.length === 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                    Add at least one image to showcase your property
                  </p>
                )}
              </div>

              {/* Image Tips */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">📸 Image Tips</h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Use high-quality images (at least 1024x768)</li>
                  <li>• First image or Primary image will be the cover photo</li>
                  <li>• Show different angles and rooms</li>
                  <li>• Good lighting makes a big difference</li>
                  <li>• You can use image hosting services like Imgur, Google Photos, etc.</li>
                </ul>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              if (step === 1) {
                onClose();
              } else {
                setStep(step - 1);
              }
            }}
            className="px-5 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Creating...
                  </>
                ) : (
                  'Create Property'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyModal;

