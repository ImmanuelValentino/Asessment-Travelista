<script setup>
import { ref } from "vue";

const staffName = ref("");
const staffId = ref("");
const eventCode = ref("");
const rawDate = ref("");
const venueType = ref("");

const drawnSeats = ref([]);
const errorMessage = ref("");
const isLoading = ref(false);

const formatEventDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

const handleDrawLuckySeats = async () => {
  errorMessage.value = "";
  drawnSeats.value = [];

  // input validation
  if (
    !staffName.value ||
    !staffId.value ||
    !eventCode.value ||
    !rawDate.value ||
    !venueType.value
  ) {
    errorMessage.value = "Data tidak boleh kosong";
    return;
  }

  isLoading.value = true;
  const formattedDate = formatEventDate(rawDate.value);

  try {
    const checkResponse = await $fetch("http://localhost:3001/api/check", {
      method: "POST",
      body: {
        eventCode: eventCode.value,
        date: formattedDate,
      },
    });

    if (checkResponse.exists) {
      errorMessage.value = `Lucky draw telah dilakukan untuk event ${eventCode.value} pada ${formattedDate}.`;
      isLoading.value = false;
      return;
    }

    //kalau belum ada hasil draw untuk event+date nya, lanjut ke proses draw
    const drawResponse = await $fetch("http://localhost:3001/api/draw", {
      method: "POST",
      body: {
        staffName: staffName.value,
        staffId: staffId.value,
        eventCode: eventCode.value,
        date: formattedDate,
        venue: venueType.value,
      },
    });

    if (drawResponse.success) {
      // Display 3 lucky seats
      drawnSeats.value = drawResponse.seats;
    } else {
      errorMessage.value = drawResponse.message;
    }
  } catch (error) {
    errorMessage.value = "Server Mungkin Crash";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen py-10 px-4">
    <div class="max-w-xl mx-auto rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold mb-6  pb-2">Event Lucky Draw</h1>

      <div class="space-y-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Staff Name <span class="text-red-500">*</span></label
          >
          <input
            v-model="staffName"
            type="text"
            class="w-full border rounded p-2 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Staff ID <span class="text-red-500">*</span></label
          >
          <input
            v-model="staffId"
            type="text"
            class="w-full border rounded p-2 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Event Code <span class="text-red-500">*</span></label
          >
          <input
            v-model="eventCode"
            type="text"
            placeholder="e.g., EVT-2025-001"
            class="w-full border rounded p-2 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Event Date (DD-MM-YYYY) <span class="text-red-500">*</span></label
          >
          <input
            v-model="rawDate"
            type="date"
            class="w-full border rounded p-2 focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Venue Type <span class="text-red-500">*</span></label
          >
          <select
            v-model="venueType"
            class="w-full border rounded p-2 focus:ring focus:ring-blue-200"
            required
          >
            <option value="" disabled>Select Venue...</option>
            <option value="Studio Room">Studio Room</option>
            <option value="Concert Hall">Concert Hall</option>
            <option value="Open Arena">Open Arena</option>
          </select>
        </div>
      </div>

      <button
        @click="handleDrawLuckySeats"
        :disabled="isLoading"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 transition"
      >
        {{ isLoading ? "Processing..." : "Draw Lucky Seats" }}
      </button>

      <div
        v-if="errorMessage"
        class="mt-4 p-3 bg-red-100 text-red-700 rounded border border-red-200"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="drawnSeats.length > 0"
        class="mt-6 p-4 bg-green-50 border border-green-200 rounded text-center"
      >
        <h2 class="text-lg font-semibold text-green-800 mb-2">Your Lucky Seats:</h2>
        <div class="flex justify-center gap-4">
          <span
            v-for="seat in drawnSeats.join(',')"
            :key="seat"
            class="bg-green-600 text-white font-bold py-1 px-3 rounded-full text-lg shadow"
          >
            {{ seat }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
