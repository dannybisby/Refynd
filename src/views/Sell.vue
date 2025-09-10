<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const currentStep = computed(() => store.state.listings.currentComposer.step)
const composerData = computed(() => store.state.listings.currentComposer.data)
const drafts = computed(() => store.state.listings.drafts)
const templates = computed(() => store.state.listings.templates)

const stepTitles = [
  'Details',
  'Photos', 
  'Pricing',
  'Cross-post',
  'Review'
]

const formData = ref({
  brand: '',
  model: '',
  storage: '',
  condition: '',
  inclusions: [],
  description: '',
  photos: [],
  suggestedPrice: 0,
  floorPrice: 0,
  ceilingPrice: 0,
  platforms: ['vinted']
})

const conditions = [
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'for_parts', label: 'For Parts' }
]

const inclusionOptions = [
  'Original Box',
  'Charger',
  'Earphones',
  'Manual',
  'Screen Protector',
  'Case'
]

const platforms = [
  { id: 'vinted', name: 'Vinted', enabled: true },
  { id: 'ebay', name: 'eBay', enabled: false }
]

const nextStep = () => {
  if (currentStep.value < 5) {
    store.dispatch('listings/setComposerStep', currentStep.value + 1)
    store.dispatch('listings/updateComposerData', formData.value)
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    store.dispatch('listings/setComposerStep', currentStep.value - 1)
  }
}

const generateAIDescription = async () => {
  const description = await store.dispatch('listings/generateDescription', formData.value)
  formData.value.description = description
}

const saveDraft = () => {
  store.dispatch('listings/saveDraft', formData.value)
  store.dispatch('toasts/showSuccess', 'Draft saved successfully')
}

const createListing = () => {
  store.dispatch('toasts/showSuccess', 'Listing created successfully')
  store.dispatch('listings/resetComposer')
  // Reset form
  formData.value = {
    brand: '',
    model: '',
    storage: '',
    condition: '',
    inclusions: [],
    description: '',
    photos: [],
    suggestedPrice: 0,
    floorPrice: 0,
    ceilingPrice: 0,
    platforms: ['vinted']
  }
}

const calculateFees = (price) => {
  return (price * 0.1).toFixed(2)
}

const calculateNet = (price) => {
  return (price - price * 0.1).toFixed(2)
}

const isStepValid = (step) => {
  switch (step) {
    case 1:
      return formData.value.brand && formData.value.model && formData.value.condition
    case 2:
      return formData.value.photos.length > 0
    case 3:
      return formData.value.suggestedPrice > 0
    case 4:
      return formData.value.platforms.length > 0
    case 5:
      return true
    default:
      return false
  }
}

onMounted(() => {
  // Set suggested pricing based on mock comps
  if (formData.value.brand && formData.value.model) {
    formData.value.suggestedPrice = 450
    formData.value.floorPrice = 380
    formData.value.ceilingPrice = 520
  }
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create Listing</h1>
        <p class="text-gray-600 dark:text-gray-400">Compose a new listing for your item</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="saveDraft"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 text-sm font-medium"
        >
          Save Draft
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Stepper Navigation -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Progress</h3>
        <nav class="space-y-2">
          <div
            v-for="(title, index) in stepTitles"
            :key="index + 1"
            :class="[
              'flex items-center px-3 py-2 rounded-md text-sm font-medium',
              currentStep === index + 1
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : isStepValid(index + 1) || currentStep > index + 1
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400'
            ]"
          >
            <span
              :class="[
                'flex items-center justify-center w-6 h-6 rounded-full text-xs mr-3',
                currentStep === index + 1
                  ? 'bg-primary-600 text-white'
                  : isStepValid(index + 1) || currentStep > index + 1
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              ]"
            >
              <svg v-if="isStepValid(index + 1) && currentStep > index + 1" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </span>
            {{ title }}
          </div>
        </nav>

        <!-- Drafts -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Recent Drafts</h4>
          <div class="space-y-2">
            <div
              v-for="draft in drafts.slice(0, 3)"
              :key="draft.id"
              class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            >
              {{ draft.title || 'Untitled Draft' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Main Form Content -->
      <div class="lg:col-span-3">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <!-- Step 1: Details -->
          <div v-if="currentStep === 1" class="p-6 space-y-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Item Details</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand *</label>
                <input
                  v-model="formData.brand"
                  type="text"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Apple"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Model *</label>
                <input
                  v-model="formData.model"
                  type="text"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., iPhone 13 Pro"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Storage/Size</label>
                <input
                  v-model="formData.storage"
                  type="text"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 256GB"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condition *</label>
                <select
                  v-model="formData.condition"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select condition</option>
                  <option v-for="condition in conditions" :key="condition.value" :value="condition.value">
                    {{ condition.label }}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Inclusions</label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <label
                  v-for="inclusion in inclusionOptions"
                  :key="inclusion"
                  class="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    v-model="formData.inclusions"
                    :value="inclusion"
                    type="checkbox"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ inclusion }}</span>
                </label>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <button
                  @click="generateAIDescription"
                  class="px-3 py-1 bg-primary-600 text-white rounded text-xs font-medium hover:bg-primary-700"
                >
                  AI Assist
                </button>
              </div>
              <textarea
                v-model="formData.description"
                rows="4"
                class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Describe your item..."
              />
            </div>
          </div>

          <!-- Step 2: Photos -->
          <div v-if="currentStep === 2" class="p-6 space-y-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Photos</h3>
            
            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="mt-4">
                <label class="cursor-pointer">
                  <span class="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Click to upload photos
                  </span>
                  <input type="file" class="sr-only" multiple accept="image/*" />
                </label>
                <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
            </div>

            <!-- Photo grid (mock) -->
            <div v-if="formData.photos.length > 0" class="grid grid-cols-3 md:grid-cols-4 gap-4">
              <div
                v-for="(photo, index) in formData.photos"
                :key="index"
                class="aspect-square bg-gray-200 dark:bg-gray-600 rounded-lg relative"
              >
                <button class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  ×
                </button>
              </div>
            </div>

            <!-- Mock photos for demo -->
            <div class="grid grid-cols-3 md:grid-cols-4 gap-4">
              <div class="aspect-square bg-gray-200 dark:bg-gray-600 rounded-lg relative">
                <div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                  Photo 1
                </div>
              </div>
              <div class="aspect-square bg-gray-200 dark:bg-gray-600 rounded-lg relative">
                <div class="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                  Photo 2
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Pricing -->
          <div v-if="currentStep === 3" class="p-6 space-y-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Pricing</h3>
            
            <div class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <h4 class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Suggested Pricing</h4>
              <p class="text-2xl font-bold text-blue-900 dark:text-blue-200">£450</p>
              <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">Based on recent sales of similar items</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ask Price *</label>
                <input
                  v-model.number="formData.suggestedPrice"
                  type="number"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="450"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Floor Price</label>
                <input
                  v-model.number="formData.floorPrice"
                  type="number"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="380"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ceiling Price</label>
                <input
                  v-model.number="formData.ceilingPrice"
                  type="number"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="520"
                />
              </div>
            </div>

            <!-- Fee Calculator -->
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Fee Calculator</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Ask Price:</span>
                  <span>£{{ formData.suggestedPrice || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Platform Fees (10%):</span>
                  <span>-£{{ calculateFees(formData.suggestedPrice || 0) }}</span>
                </div>
                <div class="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between font-semibold">
                  <span>NET Received:</span>
                  <span class="text-green-600 dark:text-green-400">£{{ calculateNet(formData.suggestedPrice || 0) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Cross-post -->
          <div v-if="currentStep === 4" class="p-6 space-y-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Cross-post Options</h3>
            
            <div class="space-y-4">
              <div
                v-for="platform in platforms"
                :key="platform.id"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <input
                      v-model="formData.platforms"
                      :value="platform.id"
                      type="checkbox"
                      class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ platform.name }}</h4>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ platform.id === 'vinted' ? 'Primary platform - required' : 'Optional cross-posting' }}
                      </p>
                    </div>
                  </div>
                  <span
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      platform.enabled 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    ]"
                  >
                    {{ platform.enabled ? 'Available' : 'Coming Soon' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Cross-posting Notes -->
            <div class="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
              <h4 class="text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-2">Cross-posting Checklist</h4>
              <ul class="text-xs text-yellow-800 dark:text-yellow-300 space-y-1">
                <li>✓ Photos optimized for each platform</li>
                <li>✓ Titles adjusted for platform requirements</li>
                <li>✓ Pricing strategy per platform</li>
                <li>✓ Platform-specific terms compliance</li>
              </ul>
            </div>
          </div>

          <!-- Step 5: Review -->
          <div v-if="currentStep === 5" class="p-6 space-y-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Review & Create</h3>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ formData.brand }} {{ formData.model }}</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Item Details</h5>
                  <dl class="space-y-1 text-sm">
                    <div class="flex justify-between">
                      <dt class="text-gray-600 dark:text-gray-400">Condition:</dt>
                      <dd class="capitalize">{{ formData.condition }}</dd>
                    </div>
                    <div class="flex justify-between">
                      <dt class="text-gray-600 dark:text-gray-400">Storage:</dt>
                      <dd>{{ formData.storage || 'N/A' }}</dd>
                    </div>
                    <div class="flex justify-between">
                      <dt class="text-gray-600 dark:text-gray-400">Inclusions:</dt>
                      <dd>{{ formData.inclusions.length }} items</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Pricing</h5>
                  <dl class="space-y-1 text-sm">
                    <div class="flex justify-between">
                      <dt class="text-gray-600 dark:text-gray-400">Ask Price:</dt>
                      <dd class="font-medium">£{{ formData.suggestedPrice }}</dd>
                    </div>
                    <div class="flex justify-between">
                      <dt class="text-gray-600 dark:text-gray-400">Est. Fees:</dt>
                      <dd>£{{ calculateFees(formData.suggestedPrice) }}</dd>
                    </div>
                    <div class="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-1">
                      <dt class="text-gray-900 dark:text-white font-medium">NET:</dt>
                      <dd class="font-medium text-green-600 dark:text-green-400">£{{ calculateNet(formData.suggestedPrice) }}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div class="mt-4">
                <h5 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Platforms</h5>
                <div class="flex space-x-2">
                  <span
                    v-for="platform in formData.platforms"
                    :key="platform"
                    class="px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full text-xs font-medium capitalize"
                  >
                    {{ platform }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Warnings -->
            <div v-if="formData.suggestedPrice < formData.floorPrice" class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <div class="flex">
                <svg class="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Price Below Floor</h3>
                  <p class="text-sm text-red-700 dark:text-red-300">Your ask price is below the floor price. Consider adjusting.</p>
                </div>
              </div>
            </div>

            <!-- Create Actions -->
            <div class="flex space-x-4">
              <button
                @click="createListing"
                class="flex-1 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium"
              >
                Create Listing
              </button>
              <button
                @click="saveDraft"
                class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
              >
                Save Draft
              </button>
            </div>
          </div>

          <!-- Navigation -->
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-between rounded-b-lg">
            <button
              v-if="currentStep > 1"
              @click="prevStep"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              ← Previous
            </button>
            <div v-else></div>
            
            <button
              v-if="currentStep < 5"
              @click="nextStep"
              :disabled="!isStepValid(currentStep)"
              :class="[
                'px-4 py-2 rounded-md font-medium',
                isStepValid(currentStep)
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              ]"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>