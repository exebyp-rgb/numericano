// astro.config.mjs
import { defineConfig } from "astro/config";

export default defineConfig({
  // Для Cloudflare Pages обычно auto; можно явно указать при желании:
  // output: "static",

  // Если у вас есть кастомный домен numericano.com — можно задать site (не обязательно для деплоя):
/ site: "https://numericano.com",

  integrations: []
});
