<?php
/*
 * This file is part of the Axgen Bundle.
 *
 * (c) Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Acme\AxGenBundle\AxGenerator;

use Sensio\Bundle\GeneratorBundle\Generator\BundleGenerator;
use Symfony\Component\HttpKernel\Util\Filesystem;
use Sensio\Bundle\GeneratorBundle\Command\Validators;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\KernelInterface;
use Sensio\Bundle\GeneratorBundle\Manipulator\KernelManipulator;
use Sensio\Bundle\GeneratorBundle\Manipulator\RoutingManipulator;
use Acme\AxGenBundle\AxGenerator\AxUtils;

/**
 * Generate a Bundle calling the Sensio BundleGenerator
 * 
 * @author: Alejandro Hurtado <ahurt2000@gmail.com>
 */
class AxBundleGeneratorCall  { 

    private $filesystem;
    private $generator;
    
    public function __construct(Filesystem $filesystem, $skeletonDir) 
    {
        $this->filesystem = $filesystem;
        $this->generator  = new BundleGenerator($filesystem, $skeletonDir);
    }

    public function execute(Request $request, $root_dir, $kernel) 
    {
        $namespace = $request->request->get('nb_namespace');
        $bundlename = $request->request->get('nb_name');
        $format = $request->request->get('nb_format');
        $structure_add = $request->request->get('nb_structure');
        $kernel_update = $request->request->get('nb_kernel_update');
        $route_update = $request->request->get('nb_route_update');

        $dir = $request->request->get('nb_target_dir');
        $dir = $dir ? : dirname($root_dir) . '/src';

        $errors = array();

        // validate input values       
        $namespace = AxUtils::catchValidatorMsg('validateBundleNamespace', $namespace, $errors);
        $bundle = AxUtils::catchValidatorMsg('validateBundleName', $bundlename, $errors);
        $format = AxUtils::catchValidatorMsg('validateFormat', $format, $errors);

        $dir = Validators::validateTargetDir($dir, $bundle, $namespace);

        //return any errors ->validation
        $chck = AxUtils::onError($errors);
        if($chck !==false){
            return $chck;
        }
        
        if (!$this->filesystem->isAbsolutePath($dir)) {
            $dir = getcwd() . '/' . $dir;
        }

        // generate bundle         
        try{
            $this->generator->generate($namespace, $bundle, $dir, $format, $structure_add);
        }catch(\RuntimeException $e){
            $errors[]=$e->getMessage();
        }
        
        //return any errors in bundle generation
        $chck = AxUtils::onError($errors);
        if($chck !==false){
            return $chck;
        }else{
            $output[] = 'Generating the bundle code: <b>OK</b>';
        }  
        
        // check that the namespace is already autoloaded
        $chck = $this->checkAutoloader($namespace, $bundle, $dir);
        if( count($chck)>0 ){
            return  AxUtils::onError($chck);
        }
        
        // register the bundle in the Kernel class
        if ($kernel_update) {
            $chck = $this->updateKernel($kernel, $namespace, $bundle);
            if( count($chck)>0 ){
                return  AxUtils::onError($chck);
            }else{
                $output[]='Enabling the bundle inside the Kernel: <b>OK</b>';
            }         
        }
  
        // updating route file
        if($route_update){
            $chck = $this->updateRouting( $root_dir, $bundle, $format);
            if( count($chck)>0 ){
                return  AxUtils::onError($chck);
            }else{
                $output[]='Importing the bundle routing resource: <b>OK</b>';
            }       
        }
    
        return AxUtils::onSuccess($output);
    }
        
    /**
     * Test if the namespace is already autoloaded
     *  
     * @param string $namespace
     * @param string $bundle
     * @param string $dir
     * @return array 
     */
    protected function checkAutoloader($namespace, $bundle, $dir) 
    {
        if (!class_exists($namespace . '\\' . $bundle)) {
            return  array(
                '- Edit the <b>app/autoloader.php</b> file and register the bundle',
                '  namespace at the top of the <b>registerNamespaces()</b> call:',
                '',
                sprintf('<comment>    \'%s\' => \'%s\',</comment>', $namespace, realpath($dir)),
                '',
            );
        }
        return array();
    }
    
    /**
     * Register the bundle in the Kernel class
     * 
     * @param KernelInterface $kernel
     * @param string $namespace
     * @param string $bundle
     * @return array 
     */
    protected function updateKernel(KernelInterface $kernel, $namespace, $bundle) 
    {
        $manip = new KernelManipulator($kernel);
        try {
            $ret = $manip->addBundle($namespace . '\\' . $bundle);

            if (!$ret) {
                $reflected = new \ReflectionObject($kernel);

                return array(
                    sprintf('- Edit <b>%s</b>', $reflected->getFilename()),
                    '  and add the following bundle in the <b>AppKernel::registerBundles()</b> method:',
                    '',
                    sprintf('    <strong>new %s(),</strong>', $namespace . '\\' . $bundle),
                    '',
                );
            }
        } catch (\RuntimeException $e) {
            return array(
                sprintf('Bundle <comment>%s</comment> is already defined in <b>AppKernel::registerBundles()</b>.', $namespace . '\\' . $bundle),
                '',
            );
        }
        return array();
    }

    /**
     *
     * @param string $root_dir
     * @param string $bundle
     * @param string $format
     * @return array 
     */
    protected function updateRouting($root_dir, $bundle, $format)
    {
        $routing = new RoutingManipulator($root_dir.'/config/routing.yml');

        try {
            $ret = $routing->addResource($bundle, $format) ;
            if (!$ret) {
                if ('annotation' === $format) {
                    $help = sprintf("        <b>resource: \"@%s/Resources/Controller/\"</b>\n        <b>type:     annotation</b>", $bundle);
                } else {
                    $help = sprintf("        <b>resource: \"@%s/Resources/config/routing.%s\"</b>\n", $bundle, $format);
                }
                $help .= "        <b>prefix:   /</b>\n";

                return array(
                    '- Import the bundle\'s routing resource in the app main routing file:',
                    '',
                    sprintf('    <b>%s:</b>', $bundle),
                    $help,
                    '',
                );
            }
        } catch (\RuntimeException $e) {
            return array(
                sprintf('Bundle <b>%s</b> is already imported.', $bundle),
                '',
            );
        }
        return array();
    }
    
}