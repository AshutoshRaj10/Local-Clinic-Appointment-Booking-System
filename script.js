if (!window.appInitialized) {
    window.appInitialized = true;

    console.log('App Started');

    const SUPABASE_URL = 'https://emuypeayubmealbbctii.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdXlwZWF5dWJtZWFsYmJjdGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTg3MDYsImV4cCI6MjA5MTg3NDcwNn0.eZHwigLeoNo3BimgjxiI9VILXrCtRjhHyTZR_LeP2iU';
    const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

    const locationBtn = document.getElementById('get-location-btn');
    const locationText = document.getElementById('location-text');
    const queueStatus = document.getElementById('queue-status');
    const doctorSelect = document.getElementById('doctor-select');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const submitBooking = document.getElementById('submit-booking');
    const bookingForm = document.getElementById('booking-form');
    const bookingContainer = document.getElementById('booking-container');
    const successContainer = document.getElementById('success-container');
    const bookingDetails = document.getElementById('booking-details');
    const rescheduleBtn = document.getElementById('reschedule-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const doctorsContainer = document.getElementById('doctors-container');

    const allSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'];
    let selectedSlotElement = null;

    if (supabase) {
        loadDoctors();
    } else {
        renderOfflineDoctor();
    }

    function updateQueueStatus() {
        const waitTime = Math.floor(Math.random() * 45) + 5;
        queueStatus.textContent = `Current Wait: ${waitTime} mins`;
    }

    setInterval(updateQueueStatus, 15000);
    updateQueueStatus();

    locationBtn.addEventListener('click', () => {
        locationText.textContent = "Locating...";
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => {
                    const clinics = ["Narayana Health City", "Amrita Homeopathy", "Ganga Speciality Hospital"];
                    const randomClinic = clinics[Math.floor(Math.random() * clinics.length)];
                    locationText.textContent = `Nearby: ${randomClinic}`;
                },
                () => {
                    locationText.textContent = "Location access denied.";
                }
            );
        } else {
            locationText.textContent = "Geolocation not supported.";
        }
    });

    function renderOfflineDoctor() {
        if (doctorsContainer) {
            doctorsContainer.innerHTML = '';
        }
        if (doctorSelect) {
            doctorSelect.innerHTML = '<option value="">Choose a doctor...</option>';
        }
        if (doctorsContainer && doctorSelect) {
            const card = document.createElement('div');
            card.className = 'doctor-card';
            card.dataset.doctor = 'offline-dr';
            card.innerHTML = `
                <div class="doctor-avatar">⚠️</div>
                <div class="doctor-info">
                    <h3>Offline Doctor</h3>
                    <p class="specialty">UI Render Test</p>
                    <p class="timing">Unavailable</p>
                    <div class="rating">⭐⭐⭐⭐⭐</div>
                </div>
            `;
            doctorsContainer.appendChild(card);

            const option = document.createElement('option');
            option.value = 'offline-dr';
            option.textContent = 'Offline Doctor';
            doctorSelect.appendChild(option);
        }
    }

    async function loadDoctors() {
        if (doctorsContainer) {
            doctorsContainer.innerHTML = '';
        }
        if (doctorSelect) {
            doctorSelect.innerHTML = '<option value="">Choose a doctor...</option>';
        }

        if (!supabase) {
            renderOfflineDoctor();
            return;
        }

        try {
            const { data: doctors, error } = await supabase.from('doctors').select('*');
            console.log('Doctors from DB:', doctors);

            if (doctorsContainer && doctorSelect) {
                if (!doctors || doctors.length === 0) {
                    renderOfflineDoctor();
                    return;
                }

                doctors.forEach(doc => {
                    const card = document.createElement('div');
                    card.className = 'doctor-card';
                    card.dataset.doctor = doc.id;

                    const ratingStars = '⭐'.repeat(doc.rating || 5);

                    card.innerHTML = `
                        <div class="doctor-avatar">${doc.avatar}</div>
                        <div class="doctor-info">
                            <h3>${doc.name}</h3>
                            <p class="specialty">${doc.specialty}</p>
                            <p class="timing">${doc.timing}</p>
                            <div class="rating">${ratingStars}</div>
                        </div>
                    `;
                    doctorsContainer.appendChild(card);

                    const option = document.createElement('option');
                    option.value = doc.id;
                    option.textContent = doc.name;
                    doctorSelect.appendChild(option);
                });
            }
        } catch (err) {
            renderOfflineDoctor();
        }
    }

    function generateSlots() {
        timeSlotsContainer.innerHTML = '';
        selectedSlotElement = null;
        submitBooking.disabled = true;

        if (!doctorSelect.value) {
            return;
        }

        allSlots.forEach(time => {
            const slot = document.createElement('div');
            slot.classList.add('time-slot');
            slot.textContent = time;

            const isBooked = Math.random() < 0.3;

            if (isBooked) {
                slot.classList.add('booked');
            } else {
                slot.classList.add('available');
                slot.addEventListener('click', () => {
                    if (selectedSlotElement) {
                        selectedSlotElement.classList.remove('selected');
                    }
                    slot.classList.add('selected');
                    selectedSlotElement = slot;
                    submitBooking.disabled = false;
                });
            }
            timeSlotsContainer.appendChild(slot);
        });
    }

    function simulateRealtimeBooking() {
        if (!doctorSelect.value) return;

        const availableSlots = Array.from(document.querySelectorAll('.time-slot.available:not(.selected)'));
        if (availableSlots.length > 0 && Math.random() > 0.5) {
            const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
            randomSlot.classList.remove('available');
            randomSlot.classList.add('booked');
            const oldClone = randomSlot.cloneNode(true);
            randomSlot.parentNode.replaceChild(oldClone, randomSlot);
        }
    }

    doctorSelect.addEventListener('change', generateSlots);

    setInterval(simulateRealtimeBooking, 8000);

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!supabase) {
            alert("Database connection is offline.");
            return;
        }
        if (!selectedSlotElement || !doctorSelect.value) return;

        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
            alert("Please login first to confirm your booking.");
            loginModal.classList.remove('modal-hidden');
            return;
        }

        const doctorId = doctorSelect.value;
        const timeSlot = selectedSlotElement.textContent;
        const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text;

        const { data, error } = await supabase
            .from('appointments')
            .insert([{ doctor_id: doctorId, time_slot: timeSlot }]);

        if (!error) {
            bookingDetails.textContent = `Appointment with ${doctorName} at ${timeSlot} is confirmed.`;
            bookingContainer.classList.add('hidden');
            successContainer.classList.remove('hidden');
        } else {
            alert("Booking failed. Please try again.");
        }
    });

    rescheduleBtn.addEventListener('click', () => {
        successContainer.classList.add('hidden');
        bookingContainer.classList.remove('hidden');
        generateSlots();
    });

    cancelBtn.addEventListener('click', () => {
        successContainer.classList.add('hidden');
        bookingContainer.classList.remove('hidden');
        doctorSelect.value = '';
        generateSlots();
    });

    const loginModalBtn = document.getElementById('login-modal-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.getElementById('close-modal');
    const loginFormSubmit = document.getElementById('login-form-submit');

    loginModalBtn.addEventListener('click', () => {
        loginModal.classList.remove('modal-hidden');
    });

    closeModal.addEventListener('click', () => {
        loginModal.classList.add('modal-hidden');
    });

    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.add('modal-hidden');
        }
    });

    loginFormSubmit.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!supabase) return;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (!error) {
            loginModal.classList.add('modal-hidden');
            loginModalBtn.textContent = "Sign Out";
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        } else {
            alert("Login Failed: " + error.message);
        }
    });
}
