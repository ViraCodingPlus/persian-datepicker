<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Persian Datepicker Example</title>
    <link rel="stylesheet" href="{{ asset('vendor/pdatepicker/css/pdatepicker.css') }}">
</head>
<body>
    <div class="container" style="max-width: 800px; margin: 50px auto; padding: 20px; font-family: Tahoma, Arial, sans-serif;">
        <h1 style="color: #4dabf7; text-align: center; margin-bottom: 30px;">Persian Datepicker Examples</h1>
        
        <div class="example" style="margin-bottom: 30px; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h2 style="color: #495057; margin-bottom: 15px;">Basic Example</h2>
            <p style="color: #6c757d; margin-bottom: 20px;">A simple datepicker with default configuration.</p>
            <div class="form-group" style="margin-bottom: 15px;">
                <label for="basic-date" style="display: block; margin-bottom: 8px; font-weight: bold; color: #495057;">تاریخ:</label>
                @pdatepicker('basic-date')
            </div>
        </div>
        
        <div class="example" style="margin-bottom: 30px; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h2 style="color: #495057; margin-bottom: 15px;">Dark Theme</h2>
            <p style="color: #6c757d; margin-bottom: 20px;">Datepicker with dark theme.</p>
            <div class="form-group" style="margin-bottom: 15px;">
                <label for="dark-date" style="display: block; margin-bottom: 8px; font-weight: bold; color: #495057;">تاریخ:</label>
                @pdatepicker('dark-date', null, ['theme' => 'dark'])
            </div>
        </div>
        
        <div class="example" style="margin-bottom: 30px; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h2 style="color: #495057; margin-bottom: 15px;">With Time Picker</h2>
            <p style="color: #6c757d; margin-bottom: 20px;">Datepicker with time picker enabled.</p>
            <div class="form-group" style="margin-bottom: 15px;">
                <label for="time-date" style="display: block; margin-bottom: 8px; font-weight: bold; color: #495057;">تاریخ و زمان:</label>
                @pdatepicker('time-date', null, ['timePicker' => true, 'format' => 'YYYY/MM/DD HH:mm'])
            </div>
        </div>
        
        <div class="example" style="margin-bottom: 30px; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h2 style="color: #495057; margin-bottom: 15px;">Different Format</h2>
            <p style="color: #6c757d; margin-bottom: 20px;">Datepicker with a different date format.</p>
            <div class="form-group" style="margin-bottom: 15px;">
                <label for="format-date" style="display: block; margin-bottom: 8px; font-weight: bold; color: #495057;">تاریخ:</label>
                @pdatepicker('format-date', null, ['format' => 'YY-MM-DD'])
            </div>
        </div>
        
        <div class="example" style="margin-bottom: 30px; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <h2 style="color: #495057; margin-bottom: 15px;">Initial Value</h2>
            <p style="color: #6c757d; margin-bottom: 20px;">Datepicker with an initial value.</p>
            <div class="form-group" style="margin-bottom: 15px;">
                <label for="initial-date" style="display: block; margin-bottom: 8px; font-weight: bold; color: #495057;">تاریخ:</label>
                @pdatepicker('initial-date', '1402/01/01')
            </div>
        </div>
    </div>
    
    <script src="{{ asset('vendor/pdatepicker/js/pdatepicker.js') }}"></script>
</body>
</html> 