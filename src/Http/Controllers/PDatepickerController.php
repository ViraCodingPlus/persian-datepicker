<?php

namespace PDatepicker\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Morilog\Jalali\Jalalian;

class PDatepickerController extends Controller
{
    /**
     * Convert date between Jalali and Gregorian
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function convertDate(Request $request)
    {
        $date = $request->input('date');
        $format = $request->input('format', 'Y/m/d');
        $toJalali = $request->input('to_jalali', true);

        if ($toJalali) {
            // Convert Gregorian to Jalali
            try {
                $jalaliDate = Jalalian::fromDateTime($date)->format($format);
                return response()->json(['success' => true, 'date' => $jalaliDate]);
            } catch (\Exception $e) {
                return response()->json(['success' => false, 'message' => 'Invalid date format.'], 422);
            }
        } else {
            // Convert Jalali to Gregorian
            try {
                $parts = explode('/', $date);
                if (count($parts) !== 3) {
                    throw new \Exception('Invalid date format');
                }
                
                $gregorianDate = Jalalian::fromFormat('Y/m/d', $date)->toCarbon()->format($format);
                return response()->json(['success' => true, 'date' => $gregorianDate]);
            } catch (\Exception $e) {
                return response()->json(['success' => false, 'message' => 'Invalid date format.'], 422);
            }
        }
    }
} 