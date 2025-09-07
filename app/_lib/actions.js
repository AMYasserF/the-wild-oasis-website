'use server';

import { revalidatePath } from 'next/cache';
import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { getBookings } from './data-service';
import { redirect } from 'next/navigation';

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in ');

  const nationalID = formData.get('nationalID');
  const [nationality, countryFlag] = formData.get('nationality').split('%');

  const regex = /^\d{6,12}$/;
  if (!regex.test(nationalID)) throw new Error('Enter a valid national ID');

  const updatedData = { nationality, nationalID, countryFlag };

  const { data, error } = await supabase
    .from('guests')
    .update(updatedData)
    .eq('id', session.user.guestId)
    .select()
    .single();

  if (error) throw new Error('Guest could not be updated');

  revalidatePath('/account/profile');
}

export async function updateBooking(formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in ');

  const observations = formData.get('observations').slice(0, 1000);

  const numGuests = Number(formData.get('numGuests'));

  const updatedData = { numGuests, observations };

  const bookingId = Number(formData.get('bookingId'));

  const bookings = await getBookings(session.user.guestId);

  const bookingsIds = bookings.map((booking) => booking.id);

  if (!bookingsIds.includes(bookingId))
    throw new Error('You are not allowed to update this booking');

  const { data, error } = await supabase
    .from('bookings')
    .update(updatedData)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw new Error('Booking could not be updated');
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath('/account/reservations');
  redirect('/account/reservations');
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in ');

//   const formDataObject = Object.entries(formData.entries);
// use this in case of alot of form data;
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations').slice(0,1000),
    extrasPrice:0,
    totalPrice: bookingData.cabinPrice,
    status: 'unconfirmed',
    hasBreakfast: false,
    isPaid: false
  };

  const { error } = await supabase
    .from('bookings')
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error)  throw new Error('Booking could not be created');
  
  revalidatePath(`cabins/${bookingData.cabinId}`);
  redirect('/cabins/thankyou')
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in ');

  // For testing
  //    await new Promise((res) => setTimeout(res, 2000));
  //    throw new Error();

  const bookings = await getBookings(session.user.guestId);
  console.log(bookings);
  const bookingsIds = bookings.map((booking) => booking.id);

  if (!bookingsIds.includes(bookingId))
    throw new Error('You are not allowed to delete this booking');

  const { data, error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) throw new Error('Booking could not be deleted');

  revalidatePath('/account/reservations');
}

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
