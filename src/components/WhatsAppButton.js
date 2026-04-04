export default function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/917879230515?text=Hi%2C%20I%20want%20to%20rent%20a%20bike"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-6 right-6 z-[9999] flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-transform hover:scale-105"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="32"
                height="32"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.737 5.489 2.027 7.8L0 32l8.418-2.004A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.93 22.618c-.33.927-1.637 1.697-2.687 1.921-.717.153-1.654.275-4.808-1.033-4.036-1.648-6.635-5.743-6.836-6.007-.193-.264-1.627-2.163-1.627-4.127 0-1.963 1.028-2.927 1.393-3.325.33-.363.72-.454.96-.454.24 0 .48.002.69.013.222.012.52-.084.813.62.302.722 1.026 2.495 1.116 2.676.09.181.15.393.03.633-.12.24-.18.39-.36.6-.18.21-.378.469-.54.63-.18.18-.368.374-.158.733.21.36.934 1.54 2.005 2.494 1.378 1.228 2.54 1.608 2.9 1.788.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1.99 2.46 1.17.36.18.6.27.69.42.09.15.09.87-.24 1.797z" />
            </svg>
        </a>
    );
}
