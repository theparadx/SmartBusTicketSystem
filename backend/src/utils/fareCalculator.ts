export const stations = [
  { name: 'Krishnarajapuram', distanceFromPrev: 0 },
  { name: 'Kartik Nagar', distanceFromPrev: 20 },
  { name: 'Kalamandira', distanceFromPrev: 7 },
  { name: 'Marathahalli Bridge', distanceFromPrev: 6 },
  { name: 'Marathahalli Multiplex', distanceFromPrev: 6 },
  { name: 'Kadubisnahalli', distanceFromPrev: 18 },
  { name: 'New Horizon College', distanceFromPrev: 10 },
  { name: 'Devarabisanahalli', distanceFromPrev: 8 },
  { name: 'Ecospace', distanceFromPrev: 12 },
  { name: 'Bellandur', distanceFromPrev: 15 },
  { name: 'Sarjapura', distanceFromPrev: 25 },
];

export const calculateFareAmount = (
  source: string, 
  destination: string, 
  busType: 'AC' | 'NON_AC',
  adults: number = 1,
  children: number = 0
): number => {
  const startIndex = stations.findIndex(s => s.name.toLowerCase() === source.toLowerCase());
  const endIndex = stations.findIndex(s => s.name.toLowerCase() === destination.toLowerCase());

  if (startIndex === -1 || endIndex === -1 || startIndex === endIndex) {
    throw new Error('Invalid stations or same source and destination');
  }

  const start = Math.min(startIndex, endIndex);
  const end = Math.max(startIndex, endIndex);

  let acAdultFare = 0;
  for (let i = start + 1; i <= end; i++) {
    acAdultFare += stations[i].distanceFromPrev;
  }

  const nonAcAdultFare = Math.floor(acAdultFare * 0.7);
  const adultFare = busType === 'AC' ? acAdultFare : nonAcAdultFare;
  const childFare = Math.floor(adultFare / 2); // child fare is half of adult

  return (adultFare * adults) + (childFare * children);
};
