# Persian Datepicker for Laravel

A simple, clean, and customizable Persian (Jalali) datepicker package for Laravel applications.

![Persian Datepicker](https://via.placeholder.com/800x450.png?text=Persian+Datepicker)

## Features

- 📅 Persian (Jalali) calendar support
- 🎨 Multiple themes (default, dark, blue)
- 🔄 Easy conversion between Jalali and Gregorian dates
- ⚙️ Highly customizable with various options
- 🕒 Time picker support
- 📱 Responsive and mobile-friendly
- 🔤 Multi-language support (Persian and English)
- 🖌️ RTL and LTR support
- 🚀 Simple integration with Laravel Blade

## Requirements

- PHP 7.3 or higher
- Laravel 8.0 or higher

## Installation

You can install the package via composer:

```bash
composer require pdatepicker/persian-datepicker
```

After installing the package, you need to publish the assets:

```bash
php artisan vendor:publish --tag=pdatepicker-assets
```

Optionally, you can publish the configuration file:

```bash
php artisan vendor:publish --tag=pdatepicker-config
```

## Basic Usage

### Using the Blade Directive

The simplest way to use the datepicker is with the Blade directive:

```blade
@pdatepicker('date-field')
```

### With Custom Options

```blade
@pdatepicker('date-field', '1402/01/01', [
    'theme' => 'dark',
    'format' => 'YYYY/MM/DD',
    'timePicker' => true
])
```

### Using the Facade

```php
use PDatepicker\Facades\PDatepicker;

// Convert Gregorian to Jalali
$jalaliDate = PDatepicker::toJalali('2023-03-21');

// Convert Jalali to Gregorian
$gregorianDate = PDatepicker::toGregorian('1402/01/01');

// Get current Jalali date
$now = PDatepicker::now();
```

### Using JavaScript Directly

```html
<input type="text" id="date-picker">

<script>
    document.addEventListener('DOMContentLoaded', function() {
        new PDatepicker('#date-picker', {
            format: 'YYYY/MM/DD',
            theme: 'default',
            rtl: true,
            language: 'fa',
            autoClose: true
        });
    });
</script>
```

## Configuration Options

You can configure the datepicker by editing the `config/pdatepicker.php` file:

```php
return [
    'format' => 'YYYY/MM/DD',
    'theme' => 'default',
    'rtl' => true,
    'language' => 'fa',
    'autoClose' => true,
    'timePicker' => false,
    'viewMode' => 'day',
];
```

## Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | string | 'YYYY/MM/DD' | Date format |
| `theme` | string | 'default' | Datepicker theme ('default', 'dark', 'blue') |
| `rtl` | boolean | true | Enable RTL mode |
| `language` | string | 'fa' | Language ('fa', 'en') |
| `autoClose` | boolean | true | Close datepicker after selecting a date |
| `timePicker` | boolean | false | Show time picker |
| `viewMode` | string | 'day' | Initial view mode ('day', 'month', 'year') |
| `minDate` | string | null | Minimum selectable date |
| `maxDate` | string | null | Maximum selectable date |
| `initialValue` | string | null | Initial date value |
| `position` | string | 'bottom' | Datepicker position ('bottom', 'top') |
| `altField` | string | null | Alternative field selector |
| `altFormat` | string | null | Alternative field format |
| `onSelect` | function | null | Callback when a date is selected |
| `onShow` | function | null | Callback when datepicker is shown |
| `onHide` | function | null | Callback when datepicker is hidden |

## Methods

### PHP Methods

| Method | Description |
|--------|-------------|
| `toJalali($date, $format = 'Y/m/d')` | Convert Gregorian date to Jalali |
| `toGregorian($date, $format = 'Y-m-d')` | Convert Jalali date to Gregorian |
| `now($format = 'Y/m/d')` | Get current Jalali date |
| `render($name, $value = null, array $options = [])` | Render datepicker HTML |

### JavaScript Methods

| Method | Description |
|--------|-------------|
| `show()` | Show the datepicker |
| `hide()` | Hide the datepicker |
| `setDate(date)` | Set the datepicker date programmatically |

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information. 