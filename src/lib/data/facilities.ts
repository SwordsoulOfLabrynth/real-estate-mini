import { Facility } from '@/types';

export const INITIAL_FACILITIES: Facility[] = [
  // --- Mandalay Facilities (Chanmyathazi / Mahaaungmye / Aungmyethazan) ---
  {
    id: 'fac-mdy-01',
    name: 'Mandalay International Science Academy',
    type: 'school',
    latitude: 21.9338,
    longitude: 96.0862,
    address: '62nd Street, Chanmyathazi',
    township: 'Chanmyathazi'
  },
  {
    id: 'fac-mdy-02',
    name: 'Basic Education High School No. 22',
    type: 'school',
    latitude: 21.9421,
    longitude: 96.0829,
    address: 'Near 68th Street, Chanmyathazi',
    township: 'Chanmyathazi'
  },
  {
    id: 'fac-mdy-03',
    name: 'Mandalay General Hospital',
    type: 'hospital',
    latitude: 21.9685,
    longitude: 96.0892,
    address: '30th Street, between 74th & 77th, Chanayethazan',
    township: 'Chanayethazan'
  },
  {
    id: 'fac-mdy-04',
    name: 'Kandawgyi Private Hospital',
    type: 'hospital',
    latitude: 21.9254,
    longitude: 96.0945,
    address: '73rd Street, Chanmyathazi',
    township: 'Chanmyathazi'
  },
  {
    id: 'fac-mdy-05',
    name: 'Mingalar Mandalay Fresh Market & Mall',
    type: 'market',
    latitude: 21.9360,
    longitude: 96.0935,
    address: '73rd Street, Chanmyathazi',
    township: 'Chanmyathazi'
  },
  {
    id: 'fac-mdy-06',
    name: 'Zay Cho Historic Wholesale Market',
    type: 'market',
    latitude: 21.9789,
    longitude: 96.0812,
    address: '84th Street & 26th B Road, Mahaaungmye',
    township: 'Mahaaungmye'
  },
  {
    id: 'fac-mdy-07',
    name: 'KBZ Bank - Chanmyathazi Branch',
    type: 'bank',
    latitude: 21.9312,
    longitude: 96.0874,
    address: '62nd Street, Chanmyathazi',
    township: 'Chanmyathazi'
  },
  {
    id: 'fac-mdy-08',
    name: 'AYA Bank - Mingalar Mandalay Branch',
    type: 'bank',
    latitude: 21.9345,
    longitude: 96.0950,
    address: '73rd Street, Chanmyathazi',
    township: 'Chanmyathazi'
  },
  {
    id: 'fac-mdy-09',
    name: 'Chanmyathazi Central Bus Terminal',
    type: 'bus_stop',
    latitude: 21.9231,
    longitude: 96.0815,
    address: 'Near Airport Road, Chanmyathazi',
    township: 'Chanmyathazi'
  },
  {
    id: 'fac-mdy-10',
    name: 'Mandalay Royal Palace Moat Park & Promenade',
    type: 'park',
    latitude: 21.9930,
    longitude: 96.0905,
    address: '66th Street Moat Walk, Aungmyethazan',
    township: 'Aungmyethazan'
  },
  {
    id: 'fac-mdy-11',
    name: 'Kandawgyi Lake Garden & Boardwalk',
    type: 'park',
    latitude: 21.9215,
    longitude: 96.0980,
    address: 'Kandawgyi Ring Road, Chanmyathazi',
    township: 'Chanmyathazi'
  },

  // --- Yangon Facilities (Bahan / Kamayut / Yankin / Dagon) ---
  {
    id: 'fac-ygn-01',
    name: 'Yangon International School (YIS)',
    type: 'school',
    latitude: 16.8245,
    longitude: 96.1534,
    address: 'University Avenue Road, Bahan',
    township: 'Bahan'
  },
  {
    id: 'fac-ygn-02',
    name: 'Yangon University Campus & Libraries',
    type: 'school',
    latitude: 16.8270,
    longitude: 96.1332,
    address: 'University Avenue, Kamayut',
    township: 'Kamayut'
  },
  {
    id: 'fac-ygn-03',
    name: 'Bahan Specialist Hospital',
    type: 'hospital',
    latitude: 16.8182,
    longitude: 96.1485,
    address: 'Sayar San Road, Bahan',
    township: 'Bahan'
  },
  {
    id: 'fac-ygn-04',
    name: 'Yangon General Hospital (YGH)',
    type: 'hospital',
    latitude: 16.7825,
    longitude: 96.1528,
    address: 'Bogyoke Aung San Road, Latha',
    township: 'Latha'
  },
  {
    id: 'fac-ygn-05',
    name: 'Marketplace by City Mart (Golden Valley)',
    type: 'market',
    latitude: 16.8152,
    longitude: 96.1542,
    address: 'Dhamazedi Road, Bahan',
    township: 'Bahan'
  },
  {
    id: 'fac-ygn-06',
    name: 'Junction Square Supermarket & Complex',
    type: 'market',
    latitude: 16.8195,
    longitude: 96.1285,
    address: 'Pyay Road, Kamayut',
    township: 'Kamayut'
  },
  {
    id: 'fac-ygn-07',
    name: 'Myanmar Plaza & HAGL Retail Center',
    type: 'market',
    latitude: 16.8298,
    longitude: 96.1585,
    address: 'Kaba Aye Pagoda Road, Bahan',
    township: 'Bahan'
  },
  {
    id: 'fac-ygn-08',
    name: 'KBZ Bank - Golden Valley Branch',
    type: 'bank',
    latitude: 16.8170,
    longitude: 96.1520,
    address: 'Golden Valley Road, Bahan',
    township: 'Bahan'
  },
  {
    id: 'fac-ygn-09',
    name: 'CB Bank - Kamayut Branch',
    type: 'bank',
    latitude: 16.8228,
    longitude: 96.1278,
    address: 'Pyay Road, Kamayut',
    township: 'Kamayut'
  },
  {
    id: 'fac-ygn-10',
    name: 'YBS Hledan Junction Bus Hub',
    type: 'bus_stop',
    latitude: 16.8258,
    longitude: 96.1289,
    address: 'Hledan Crossing, Kamayut',
    township: 'Kamayut'
  },
  {
    id: 'fac-ygn-11',
    name: 'Inya Lake Park & Jogging Track',
    type: 'park',
    latitude: 16.8320,
    longitude: 96.1480,
    address: 'Kaba Aye Pagoda Road, Mayangone / Bahan',
    township: 'Bahan'
  },
  {
    id: 'fac-ygn-12',
    name: 'People’s Park & Cultural Grounds',
    type: 'park',
    latitude: 16.7995,
    longitude: 96.1425,
    address: 'Pyidaungsu Yeiktha Road, Dagon',
    township: 'Dagon'
  }
];
