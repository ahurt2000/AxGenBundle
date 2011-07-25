<?php
/**
 * Class AxUtils 
 * bundle: AxgenBundle 
 * Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Acme\AxGenBundle\AxGenerator;

use Sensio\Bundle\GeneratorBundle\Command\Validators;

/**
 *  Static class with utils stuffs
 */
class AxUtils
{
    static public function onSuccess($msg){
        if (count($msg) > 0) {
            $output['success'] = true;
            $output['message'] = implode('<br>', $msg);
            return $output;
        }
        return false;
    }
    
    static public function onError($errors)
    {   
        if (count($errors) > 0) {
            $output['success'] = false;
            $output['message'] = implode('<br>', $errors);
            return $output;
        }
        return false;
    }
    
    static public function catchValidatorMsg($method, $param, &$errors) {
        try {
            $param = Validators::$method($param);
        } catch (\InvalidArgumentException $e) {
            $errors[] = $e->getMessage();
        }
        return $param;
    }
}