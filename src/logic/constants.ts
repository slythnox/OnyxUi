import { CodeTheme, BackgroundOption } from '../features/snippet-maker/types';
import { IconCategory } from '../features/icon-maker/types';

export const CODE_THEMES: CodeTheme[] = [
    {
        name: 'AMOLED',
        value: 'amoled',
        background: '#000000',
        color: '#ffffff'
    },
    {
        name: 'Dracula',
        value: 'dracula',
        background: '#282a36',
        color: '#f8f8f2'
    },
    {
        name: 'GitHub Light',
        value: 'github-light',
        background: '#ffffff',
        color: '#24292f'
    },
    {
        name: 'Monokai',
        value: 'monokai',
        background: '#272822',
        color: '#f8f8f2'
    },
    {
        name: 'One Dark',
        value: 'one-dark',
        background: '#282c34',
        color: '#abb2bf'
    },
    {
        name: 'Tokyo Night',
        value: 'tokyo-night',
        background: '#1a1b26',
        color: '#a9b1d6'
    }
];

export const BACKGROUND_OPTIONS: BackgroundOption[] = [
    {
        name: 'Purple Gradient',
        value: 'purple',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
        name: 'Blue Gradient',
        value: 'blue',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
        name: 'Green Gradient',
        value: 'green',
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    {
        name: 'Orange Gradient',
        value: 'orange',
        gradient: 'linear-gradient(135deg, #FF4B1F 0%, #FF9068 100%)'
    },
    {
        name: 'Dark Gradient',
        value: 'dark',
        gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
    },
    {
        name: 'Light Gradient',
        value: 'light',
        gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }
];

export const LANGUAGES = [
    { name: 'JavaScript', value: 'javascript' },
    { name: 'TypeScript', value: 'typescript' },
    { name: 'Python', value: 'python' },
    { name: 'Java', value: 'java' },
    { name: 'C++', value: 'cpp' },
    { name: 'HTML', value: 'html' },
    { name: 'CSS', value: 'css' },
    { name: 'JSON', value: 'json' },
    { name: 'XML', value: 'xml' },
    { name: 'Bash', value: 'bash' }
];

export const ICON_CATEGORIES: IconCategory[] = [
    {
        name: 'Popular',
        icons: [
            'Heart', 'Star', 'Home', 'User', 'Mail', 'Phone', 'Camera', 'Search', 'Settings', 'Download',
            'Upload', 'Share', 'ThumbsUp', 'Shield', 'Lock', 'Unlock', 'Key', 'Bell', 'Calendar', 'Clock'
        ]
    },
    {
        name: 'Arrows & Navigation',
        icons: [
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ChevronUp', 'ChevronDown', 'ChevronLeft',
            'ChevronRight', 'Menu', 'X', 'Plus', 'Minus', 'MoreHorizontal', 'MoreVertical', 'Navigation',
            'Compass', 'MapPin', 'Map', 'Route', 'Signpost'
        ]
    },
    {
        name: 'Media & Entertainment',
        icons: [
            'Play', 'Pause', 'Stop', 'SkipForward', 'SkipBack', 'FastForward', 'Rewind', 'Volume2',
            'VolumeX', 'Music', 'Headphones', 'Mic', 'MicOff', 'Video', 'VideoOff', 'Image', 'Film',
            'Tv', 'Radio', 'Gamepad2'
        ]
    },
    {
        name: 'Files & Folders',
        icons: [
            'File', 'FileText', 'Folder', 'FolderOpen', 'Archive', 'Copy', 'Cut', 'Paste', 'Trash2',
            'Save', 'Download', 'Upload', 'Link', 'Paperclip', 'Database', 'HardDrive', 'Server',
            'Cloud', 'CloudDownload', 'CloudUpload'
        ]
    },
    {
        name: 'Communication',
        icons: [
            'MessageCircle', 'MessageSquare', 'Mail', 'Send', 'Inbox', 'Phone', 'PhoneCall', 'PhoneOff',
            'Users', 'UserPlus', 'UserMinus', 'UserCheck', 'UserX', 'AtSign', 'Hash', 'Smile',
            'ThumbsUp', 'ThumbsDown', 'Heart', 'MessageHeart'
        ]
    },
    {
        name: 'Technology',
        icons: [
            'Smartphone', 'Tablet', 'Laptop', 'Monitor', 'Wifi', 'WifiOff', 'Bluetooth', 'Battery',
            'BatteryLow', 'Plug', 'Power', 'PowerOff', 'Cpu', 'HardDrive', 'MemoryStick', 'Usb',
            'Cable', 'Satellite', 'Router', 'Antenna'
        ]
    },
    {
        name: 'Business & Finance',
        icons: [
            'DollarSign', 'CreditCard', 'Wallet', 'Banknote', 'Calculator', 'TrendingUp', 'TrendingDown',
            'BarChart', 'PieChart', 'Activity', 'Target', 'Award', 'Briefcase', 'Building', 'Building2',
            'Store', 'ShoppingCart', 'ShoppingBag', 'Tag', 'Receipt'
        ]
    },
    {
        name: 'Weather & Nature',
        icons: [
            'Sun', 'Moon', 'CloudRain', 'Cloud', 'CloudSnow', 'Zap', 'Umbrella', 'Droplets', 'Wind',
            'Thermometer', 'Sunrise', 'Sunset', 'TreePine', 'Flower', 'Leaf', 'Mountain', 'Waves',
            'Globe', 'Earth', 'Flame'
        ]
    }
];

export const DEFAULT_CODE = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Generate first 10 Fibonacci numbers
const numbers = [];
for (let i = 0; i < 10; i++) {
  numbers.push(fibonacci(i));
}

console.log('Fibonacci sequence:', numbers);`;
