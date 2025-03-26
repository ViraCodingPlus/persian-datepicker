# Persian Datepicker for Laravel

A modern, elegant, and feature-rich Persian (Jalali) datepicker package for Laravel applications, with extensive customization options.

![Persian Datepicker](https://via.placeholder.com/800x450.png?text=Persian+Datepicker)

## Features

- 📅 Persian (Jalali) calendar support with weekend highlighting
- 🎨 Multiple themes (default, dark, blue) with complete customization
- 🔄 Seamless conversion between Jalali and Gregorian dates
- ⚙️ Highly configurable with numerous options
- 🕒 Advanced time picker with 12/24 hour format support
- 📆 Multiple calendar types (date, month, year) for different selection needs
- 📱 Fully responsive and mobile-friendly design
- 🔤 Multi-language support (Persian and English)
- 🖌️ RTL and LTR support for multi-directional applications
- 🚀 Effortless integration with Laravel Blade directives
- 🎯 Support for model binding in Laravel forms

## Laravel Compatibility

| Laravel Version | Package Version |
|-----------------|-----------------|
| 10.x            | 1.x             |
| 9.x             | 1.x             |
| 8.x             | 1.x             |

## Requirements

- PHP 7.3 or higher
- Laravel 8.0 or higher

## Installation

### Step 1: Install via Composer

```bash
composer require pdatepicker/persian-datepicker
```

### Step 2: Publish Assets and Configuration

For Laravel apps, publish the necessary assets and configuration file:

```bash
# Publish all resources
php artisan vendor:publish --provider="PDatepicker\PDatepickerServiceProvider"

# Or publish specific resources
php artisan vendor:publish --provider="PDatepicker\PDatepickerServiceProvider" --tag="config"
php artisan vendor:publish --provider="PDatepicker\PDatepickerServiceProvider" --tag="assets"
php artisan vendor:publish --provider="PDatepicker\PDatepickerServiceProvider" --tag="examples"
```

This will:
- Copy the JavaScript and CSS assets to your public directory
- Create the `config/pdatepicker.php` configuration file
- (Optional) Copy usage examples to your public directory

### Step 3: Add to Your Layout

Add the CSS and JavaScript files to your layout:

```html
<!-- In your head section -->
<link rel="stylesheet" href="{{ asset('vendor/pdatepicker/css/pdatepicker.css') }}">

<!-- Before closing body tag -->
<script src="{{ asset('vendor/pdatepicker/js/pdatepicker.js') }}"></script>
```

## Laravel Integration

### Using in Blade Templates

You can use the provided Blade directive to easily add datepickers to your forms:

```blade
<div class="form-group">
    <label for="birth_date">تاریخ تولد</label>
    @pdatepicker('birth_date', old('birth_date'), ['format' => 'YYYY/MM/DD'])
</div>
```

### With Laravel Collective Forms

If you're using Laravel Collective's form package:

```blade
{!! Form::open(['route' => 'users.store']) !!}
    <div class="form-group">
        {!! Form::label('birth_date', 'تاریخ تولد') !!}
        @pdatepicker('birth_date', old('birth_date'))
    </div>
    
    {!! Form::submit('ذخیره', ['class' => 'btn btn-primary']) !!}
{!! Form::close() !!}
```

### Validation

For form validation, use the `jalali_date` validation rule:

```php
use PDatepicker\Rules\JalaliDate;

public function store(Request $request)
{
    $request->validate([
        'birth_date' => ['required', new JalaliDate('Y/m/d')],
    ]);
    
    // Process validated data...
}
```

Or use the rule in your form request:

```php
use PDatepicker\Rules\JalaliDate;

class UserRequest extends FormRequest
{
    public function rules()
    {
        return [
            'birth_date' => ['required', new JalaliDate('Y/m/d')],
        ];
    }
}
```

## Working with Laravel Models

### Accessors and Mutators

Use accessors and mutators to automatically convert between Jalali and Gregorian dates:

```php
// In your model
use PDatepicker\Facades\PDatepicker;

class User extends Model
{
    /**
     * Get the birth date in Jalali format.
     *
     * @return string
     */
    public function getBirthDateJalaliAttribute()
    {
        if (!$this->birth_date) return null;
        return PDatepicker::toJalali($this->birth_date, 'Y/m/d');
    }

    /**
     * Set the birth date from Jalali to Gregorian format.
     *
     * @param  string  $value
     * @return void
     */
    public function setBirthDateJalaliAttribute($value)
    {
        if (!$value) {
            $this->attributes['birth_date'] = null;
            return;
        }
        
        $this->attributes['birth_date'] = PDatepicker::toGregorian($value, 'Y-m-d');
    }
}
```

## Examples

The package includes several complete examples to demonstrate different usage scenarios:

- **Basic Examples**: Shows simple datepicker initialization with various options
- **Advanced Examples**: Demonstrates integration with forms, date ranges, and validation
- **Calendar Types**: Showcases year, month, and date picker implementations
- **Custom Styling**: Examples of visual customization options

After publishing the assets, you can find these examples at:

```
public/vendor/pdatepicker/examples/
```

Or you can view them directly in the source code at:

```
vendor/pdatepicker/persian-datepicker/src/resources/examples/
```

## Configuration Options

You can configure default behavior by editing the `config/pdatepicker.php` file:

```php
return [
    // Default date format
    'format' => 'YYYY/MM/DD',
    
    // Visual theme (default, dark, blue)
    'theme' => 'default',
    
    // Enable RTL support for Persian text
    'rtl' => true,
    
    // Default language (fa, en)
    'language' => 'fa',
    
    // Auto close picker after selection
    'autoClose' => true,
    
    // Enable time picker component
    'timePicker' => false,
    
    // Time format (HH:mm:ss, HH:mm, hh:mm A)
    'timeFormat' => 'HH:mm:ss',
    
    // Calendar type (date, month, year)
    'type' => 'date',
    
    // Initial view mode
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
| `timeFormat` | string | 'HH:mm:ss' | Format for time display |
| `type` | string | 'date' | Calendar type ('date', 'month', 'year') |
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
| `customStyles` | object | {} | Custom CSS styles for datepicker elements |

## Methods

### PHP Methods (Available via Facade)

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
| `updateStyles(styles)` | Update datepicker styles dynamically |
| `refreshView()` | Refresh the calendar view |

## Additional Resources

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Support

If you discover any issues or have questions, please open an issue on GitHub.

### Credits

This package was created by [Your Name/Organization] and is inspired by modern datepicker solutions.

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

### Using Different Calendar Types

The package supports different calendar types to suit various input needs:

#### Date Picker (Default)

```blade
@pdatepicker('date_field', null, [
    'type' => 'date',
    'format' => 'YYYY/MM/DD'
])
```

#### Month Picker

```blade
@pdatepicker('month_field', null, [
    'type' => 'month',
    'format' => 'YYYY/MM'
])
```

#### Year Picker

```blade
@pdatepicker('year_field', null, [
    'type' => 'year',
    'format' => 'YYYY'
])
```

### JavaScript Implementation for Calendar Types

```javascript
// Date Picker
new PDatepicker('#date-input', {
    type: 'date',
    format: 'YYYY/MM/DD'
});

// Month Picker
new PDatepicker('#month-input', {
    type: 'month',
    format: 'YYYY/MM'
});

// Year Picker
new PDatepicker('#year-input', {
    type: 'year',
    format: 'YYYY'
});
```

### Theming Options

The datepicker comes with several built-in themes:

#### Default Theme
```blade
@pdatepicker('date_field', null, ['theme' => 'default'])
```

#### Dark Theme
```blade
@pdatepicker('date_field', null, ['theme' => 'dark'])
```

#### Blue Theme
```blade
@pdatepicker('date_field', null, ['theme' => 'blue'])
```

#### Custom Theme with Inline Styles

```blade
@pdatepicker('date_field', null, [
    'customStyles' => [
        'container' => [
            'backgroundColor' => '#fff',
            'boxShadow' => '0 10px 30px rgba(0, 0, 0, 0.1)',
            'borderRadius' => '15px'
        ],
        'header' => [
            'backgroundColor' => '#4a6cf7',
            'color' => '#fff',
            'borderTopLeftRadius' => '15px',
            'borderTopRightRadius' => '15px'
        ],
        'today' => [
            'backgroundColor' => '#4a6cf7',
            'color' => '#fff'
        ],
        'selected' => [
            'backgroundColor' => '#6e8ffa',
            'color' => '#fff'
        ],
        'friday' => [
            'color' => '#f44336'
        ]
    ]
])
```

#### Creating a Custom Theme with CSS

You can also create a custom theme using CSS:

1. Create a CSS file with your theme styles:

```css
/* custom-theme.css */
.pdatepicker.custom-theme {
    --primary-color: #9c27b0;
    --secondary-color: #d05ce3;
    --text-color: #212121;
    --background-color: #fff;
    --header-background: #9c27b0;
    --header-text-color: #fff;
    --border-radius: 15px;
    --day-hover-background: #e1bee7;
    --selected-day-background: #9c27b0;
    --selected-day-color: #fff;
    --today-background: #e1bee7;
    --today-color: #9c27b0;
}

.pdatepicker.custom-theme .pdp-header {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
}

.pdatepicker.custom-theme .pdp-friday {
    color: #e91e63;
}
```

2. Include the CSS file in your layout:

```html
<link rel="stylesheet" href="{{ asset('css/custom-theme.css') }}">
```

3. Use the custom theme:

```blade
@pdatepicker('date_field', null, ['theme' => 'custom-theme'])
```

### Using the Facade

The package provides a convenient facade for working with dates in your controllers and models:

```php
use PDatepicker\Facades\PDatepicker;

// Convert Gregorian to Jalali
$jalaliDate = PDatepicker::toJalali('2023-03-21');

// Convert Jalali to Gregorian
$gregorianDate = PDatepicker::toGregorian('1402/01/01');

// Get current Jalali date
$now = PDatepicker::now();

// Format for database insertion
$formattedDate = PDatepicker::toGregorian($request->birth_date, 'Y-m-d');
```

## Events and Callbacks

The datepicker supports various events and callbacks for advanced integrations:

### JavaScript Event Handling

```javascript
new PDatepicker('#date-input', {
    format: 'YYYY/MM/DD',
    onSelect: function(selectedDate) {
        console.log('Selected date:', selectedDate);
        // Update other components or trigger actions
    },
    onShow: function() {
        console.log('Datepicker opened');
        // Perform actions when calendar opens
    },
    onHide: function() {
        console.log('Datepicker closed');
        // Perform cleanup or validation when calendar closes
    },
    onChange: function(newDate) {
        console.log('Date changed to:', newDate);
        // React to user navigating through dates
    }
});
```

### Form Integration with Events

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const datePicker = new PDatepicker('#reservation-date', {
        format: 'YYYY/MM/DD',
        onSelect: function(selectedDate) {
            // Check availability via AJAX
            fetch('/check-availability?date=' + selectedDate)
                .then(response => response.json())
                .then(data => {
                    if (data.available) {
                        document.getElementById('availability-status').textContent = 'Available!';
                        document.getElementById('submit-btn').disabled = false;
                    } else {
                        document.getElementById('availability-status').textContent = 'Not available';
                        document.getElementById('submit-btn').disabled = true;
                    }
                });
        }
    });

    // Example of programmatically setting a date
    document.getElementById('reset-btn').addEventListener('click', function() {
        datePicker.setDate('1402/06/15');
    });
});
```

### Real-time Style Updates

You can dynamically change the datepicker appearance:

```javascript
const datePicker = new PDatepicker('#theme-demo', {
    format: 'YYYY/MM/DD'
});

// Later, update styles dynamically
document.getElementById('change-theme-btn').addEventListener('click', function() {
    datePicker.updateStyles({
        container: {
            backgroundColor: '#f8f9fa',
            boxShadow: '0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07)'
        },
        selected: {
            backgroundColor: '#6772e5',
            color: '#ffffff'
        }
    });
});
```

## Advanced Usage Scenarios

### Date Range Selection

Create a date range picker by linking two datepickers:

```javascript
// Initialize start date picker
const startPicker = new PDatepicker('#start-date', {
    format: 'YYYY/MM/DD',
    onSelect: function(selectedDate) {
        // When start date is selected, update end date min value
        endPicker.setMinDate(selectedDate);
    }
});

// Initialize end date picker
const endPicker = new PDatepicker('#end-date', {
    format: 'YYYY/MM/DD',
    onSelect: function(selectedDate) {
        // When end date is selected, update start date max value
        startPicker.setMaxDate(selectedDate);
    }
});
```

### Multiple Date Selection

```javascript
const multiDatePicker = new PDatepicker('#multiple-dates', {
    format: 'YYYY/MM/DD',
    multiSelect: true,
    onMultiSelect: function(selectedDates) {
        document.getElementById('selected-dates').textContent = 
            'Selected dates: ' + selectedDates.join(', ');
    }
});
```

### Inline Calendar (Without Input Field)

```blade
<div id="inline-calendar"></div>

<script>
    new PDatepicker('#inline-calendar', {
        inline: true,
        format: 'YYYY/MM/DD',
        onSelect: function(selectedDate) {
            console.log('Selected date:', selectedDate);
        }
    });
</script>
```

### Integrating with AJAX Forms

```javascript
document.getElementById('appointment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const appointmentDate = document.getElementById('appointment-date').value;
    const appointmentTime = document.getElementById('appointment-time').value;
    
    // Convert Jalali date to Gregorian for backend processing
    fetch('/api/convert-date', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({
            jalaliDate: appointmentDate
        })
    })
    .then(response => response.json())
    .then(data => {
        // Send the converted date to server
        return fetch('/api/book-appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                date: data.gregorianDate,
                time: appointmentTime
            })
        });
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showSuccessMessage('Appointment booked successfully!');
        } else {
            showErrorMessage(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showErrorMessage('An error occurred while booking your appointment.');
    });
});
```

