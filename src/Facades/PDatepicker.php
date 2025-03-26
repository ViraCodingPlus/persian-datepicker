<?php

namespace PDatepicker\Facades;

use Illuminate\Support\Facades\Facade;

class PDatepicker extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'pdatepicker';
    }
} 