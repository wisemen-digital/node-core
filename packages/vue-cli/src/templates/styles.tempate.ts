export const STYLES = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* #ffffff */
    --background: 0 0% 100%;
    /* #000000 */
    --foreground: 0 0% 0%;

    /* #f9fafb */
    --muted: 210 20% 98%;
    /* #667085 */
    --muted-foreground: 221 13% 46%;

    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 0%;

    --card: 0 0% 100%;
    --card-foreground: 0 0% 0%;

    /* #D0D5DD */
    --border: 217 16% 84%;
    --input: 0 0% 100%;

    /* #7F56D9 */
    --primary: 259 63% 59%;
    --primary-foreground: 0 0% 100%;

    /* #F4EBFF */
    --secondary: 267 100% 96%;
    /* #53389E */
    --secondary-foreground: 256 48% 42%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    /* #D92D20 */
    --destructive: 4 74% 49%;
    --destructive-foreground: 0 0% 100%;

    /* #F9F5FF */
    --ring: 264 100% 98%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;

    --muted: 223 47% 11%;
    --muted-foreground: 215.4 16.3% 56.9%;

    --popover: 224 71% 4%;
    --popover-foreground: 215 20.2% 65.1%;

    --card: 224 71% 4%;
    --card-foreground: 213 31% 91%;

    --border: 216 34% 17%;
    --input: 216 34% 17%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 1.2%;

    --secondary: 222.2 47.4% 11.2%;
    --secondary-foreground: 210 40% 98%;

    --accent: 216 34% 17%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;

    --ring: 267 100% 96%;

    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  *:focus {
    box-shadow: 0px 0px 0px 4px #F4EBFF, 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    /* @apply ring-2 ring-ring ring-offset-0 outline-none; */
  }
}`