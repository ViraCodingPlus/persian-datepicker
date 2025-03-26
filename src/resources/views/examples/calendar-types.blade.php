@extends('layouts.app')

@section('title', 'Calendar Types - PDatepicker Examples')

@section('content')
<div class="container mt-5">
    <h1>PDatepicker Calendar Types</h1>
    
    <div class="row mt-4">
        <div class="col-md-6">
            <div class="card mb-4">
                <div class="card-header">
                    <h5>Year Picker</h5>
                </div>
                <div class="card-body">
                    <p>Calendar that only allows year selection.</p>
                    
                    <form method="POST" action="#">
                        @csrf
                        <div class="form-group">
                            <label for="year">سال:</label>
                            @pdatepicker('year', old('year'), [
                                'type' => 'year',
                                'format' => 'YYYY',
                                'placeholder' => 'انتخاب سال'
                            ])
                        </div>
                        <button type="submit" class="btn btn-primary mt-3">Submit</button>
                    </form>
                    
                    <div class="mt-4">
                        <h6>Code:</h6>
                        <pre><code>@pdatepicker('year', old('year'), [
    'type' => 'year',
    'format' => 'YYYY',
    'placeholder' => 'انتخاب سال'
])</code></pre>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-md-6">
            <div class="card mb-4">
                <div class="card-header">
                    <h5>Month Picker</h5>
                </div>
                <div class="card-body">
                    <p>Calendar that only allows month and year selection.</p>
                    
                    <form method="POST" action="#">
                        @csrf
                        <div class="form-group">
                            <label for="month">ماه:</label>
                            @pdatepicker('month', old('month'), [
                                'type' => 'month',
                                'format' => 'YYYY/MM',
                                'placeholder' => 'انتخاب ماه'
                            ])
                        </div>
                        <button type="submit" class="btn btn-primary mt-3">Submit</button>
                    </form>
                    
                    <div class="mt-4">
                        <h6>Code:</h6>
                        <pre><code>@pdatepicker('month', old('month'), [
    'type' => 'month',
    'format' => 'YYYY/MM',
    'placeholder' => 'انتخاب ماه'
])</code></pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row mt-4">
        <div class="col-md-6">
            <div class="card mb-4">
                <div class="card-header">
                    <h5>Date Picker with Initial Value</h5>
                </div>
                <div class="card-body">
                    <p>Regular date picker with an initial value.</p>
                    
                    <form method="POST" action="#">
                        @csrf
                        <div class="form-group">
                            <label for="birthdate">تاریخ تولد:</label>
                            @pdatepicker('birthdate', '1402/06/15', [
                                'type' => 'date',
                                'format' => 'YYYY/MM/DD',
                                'placeholder' => 'تاریخ تولد'
                            ])
                        </div>
                        <button type="submit" class="btn btn-primary mt-3">Submit</button>
                    </form>
                    
                    <div class="mt-4">
                        <h6>Code:</h6>
                        <pre><code>@pdatepicker('birthdate', '1402/06/15', [
    'type' => 'date',
    'format' => 'YYYY/MM/DD',
    'placeholder' => 'تاریخ تولد'
])</code></pre>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-md-6">
            <div class="card mb-4">
                <div class="card-header">
                    <h5>Date & Time Picker</h5>
                </div>
                <div class="card-body">
                    <p>Date picker with time selection.</p>
                    
                    <form method="POST" action="#">
                        @csrf
                        <div class="form-group">
                            <label for="appointment">زمان قرار ملاقات:</label>
                            @pdatepicker('appointment', old('appointment'), [
                                'type' => 'date',
                                'timePicker' => true,
                                'timeFormat' => 'HH:mm',
                                'format' => 'YYYY/MM/DD',
                                'placeholder' => 'انتخاب تاریخ و زمان'
                            ])
                        </div>
                        <button type="submit" class="btn btn-primary mt-3">Submit</button>
                    </form>
                    
                    <div class="mt-4">
                        <h6>Code:</h6>
                        <pre><code>@pdatepicker('appointment', old('appointment'), [
    'type' => 'date',
    'timePicker' => true,
    'timeFormat' => 'HH:mm',
    'format' => 'YYYY/MM/DD',
    'placeholder' => 'انتخاب تاریخ و زمان'
])</code></pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row mt-4 mb-5">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h5>Custom Styled Calendar</h5>
                </div>
                <div class="card-body">
                    <p>Calendar with custom styling.</p>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <form method="POST" action="#">
                                @csrf
                                <div class="form-group">
                                    <label for="custom_date">تاریخ با استایل سفارشی:</label>
                                    @pdatepicker('custom_date', old('custom_date'), [
                                        'type' => 'date',
                                        'theme' => 'blue',
                                        'format' => 'YYYY/MM/DD',
                                        'placeholder' => 'تاریخ',
                                        'customStyles' => [
                                            'container' => [
                                                'boxShadow' => '0 10px 25px rgba(74, 107, 255, 0.2)',
                                                'borderRadius' => '12px'
                                            ],
                                            'header' => [
                                                'backgroundColor' => '#4a6bff',
                                                'color' => 'white'
                                            ],
                                            'selected' => [
                                                'backgroundColor' => '#4a6bff',
                                                'color' => 'white'
                                            ]
                                        ]
                                    ])
                                </div>
                                <button type="submit" class="btn btn-primary mt-3">Submit</button>
                            </form>
                        </div>
                        
                        <div class="col-md-6">
                            <form method="POST" action="#">
                                @csrf
                                <div class="form-group">
                                    <label for="custom_month">ماه با استایل سفارشی:</label>
                                    @pdatepicker('custom_month', old('custom_month'), [
                                        'type' => 'month',
                                        'format' => 'YYYY/MM',
                                        'placeholder' => 'ماه',
                                        'customStyles' => [
                                            'container' => [
                                                'boxShadow' => '0 10px 25px rgba(255, 82, 82, 0.2)',
                                                'borderRadius' => '12px'
                                            ],
                                            'header' => [
                                                'backgroundColor' => '#ff5252',
                                                'color' => 'white'
                                            ],
                                            'month' => [
                                                'padding' => '12px',
                                                'borderRadius' => '8px'
                                            ]
                                        ]
                                    ])
                                </div>
                                <button type="submit" class="btn btn-primary mt-3">Submit</button>
                            </form>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <h6>Code:</h6>
                        <pre><code>@pdatepicker('custom_date', old('custom_date'), [
    'type' => 'date',
    'theme' => 'blue',
    'format' => 'YYYY/MM/DD',
    'placeholder' => 'تاریخ',
    'customStyles' => [
        'container' => [
            'boxShadow' => '0 10px 25px rgba(74, 107, 255, 0.2)',
            'borderRadius' => '12px'
        ],
        'header' => [
            'backgroundColor' => '#4a6bff',
            'color' => 'white'
        ],
        'selected' => [
            'backgroundColor' => '#4a6bff',
            'color' => 'white'
        ]
    ]
])</code></pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Custom script for any additional functionality
        console.log('Calendar Types example page loaded');
    });
</script>
@endpush 