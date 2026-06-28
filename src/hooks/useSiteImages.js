import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const BASE = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/';

export const SITE_IMAGE_DEFAULTS = {
  home_cta_image: BASE + 'aed32f5d6_BF5F2F8D-A062-4252-ACB9-7CB285D370C2.jpg',
  home_basketball: BASE + '768f94d59_original-9C2CE967-E509-467A-A4F9-60BA1F7BA526.jpg',
  home_pickleball: BASE + '84dce9a45_DE3C9764-40F9-4B33-8757-92999BD56B9A.jpg',
  home_multisport: BASE + '059731f0c_original-708AB469-D7EB-4D2F-9A2F-39E474666293.jpg',
  home_garage: BASE + '10633339e_original-6B598F0B-B835-43A0-B525-5B29450691ED.jpeg',
  products_basketball: BASE + '768f94d59_original-9C2CE967-E509-467A-A4F9-60BA1F7BA526.jpg',
  products_pickleball: BASE + '84dce9a45_DE3C9764-40F9-4B33-8757-92999BD56B9A.jpg',
  products_multisport: BASE + '059731f0c_original-708AB469-D7EB-4D2F-9A2F-39E474666293.jpg',
  products_garage: BASE + '10633339e_original-6B598F0B-B835-43A0-B525-5B29450691ED.jpeg',
  hiw_step1: BASE + '5d295eb0b_PhotoFix_16_49_54.jpg',
  hiw_step2: BASE + '5ed3112db_09E84532-92AB-4A80-B6EB-D87261BE4278.jpg',
  hiw_step3: BASE + 'be593f5fa_5CD60603-39ED-400B-9F64-BB790BD0F6E7.jpg',
  hiw_step4: BASE + 'db973daa3_F12CF0B6-12D8-42B1-9B71-AC1240BBA684.jpeg',
  shop_pickleball_starter: BASE + '84dce9a45_DE3C9764-40F9-4B33-8757-92999BD56B9A.jpg',
  shop_basketball_half: BASE + '768f94d59_original-9C2CE967-E509-467A-A4F9-60BA1F7BA526.jpg',
  shop_multisport_combo: BASE + '059731f0c_original-708AB469-D7EB-4D2F-9A2F-39E474666293.jpg',
  shop_garage_double: BASE + '10633339e_original-6B598F0B-B835-43A0-B525-5B29450691ED.jpeg',
};

export function useSiteImages() {
  const { data: siteImages = [] } = useQuery({
    queryKey: ['siteImages'],
    queryFn: () => base44.entities.SiteImage.list(),
  });

  const imageMap = { ...SITE_IMAGE_DEFAULTS };
  siteImages.forEach(img => {
    imageMap[img.key] = img.image_url;
  });

  return imageMap;
}