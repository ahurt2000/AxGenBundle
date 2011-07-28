<?php
/*
 * This file is part of the Axgen Bundle.
 *
 * (c) Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace Acme\AxGenBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Acme\AxGenBundle\AxGenerator\AxBundleGeneratorCall;
use Acme\AxGenBundle\AxGenerator\AxDoctrineEntityGeneratorCall;
use Acme\AxGenBundle\AxGenerator\AxDoctrineEntitiesGeneratorCall;
use Acme\AxGenBundle\AxGenerator\AxDoctrineCrudGeneratorCall;
use Symfony\Component\DependencyInjection\Container;

class DefaultController extends Controller {

    public function indexAction() {
        $root_dir = dirname($this->container->getParameter('kernel.root_dir'));
//        $bundles = $this->container->get('kernel')->getBundles();
        return $this->render('AcmeAxGenBundle:Default:index.html.twig', array('root_dir' => $root_dir)); //, 'bundles' => $bundles));
    }
    
    /**
     * Generate a bundle 
     *  
     * @return Response 
     */
    public function genBundleAction() {
        $root_dir = $this->container->getParameter('kernel.root_dir');
        $kernel = $this->container->get('kernel');

        $generator = new AxBundleGeneratorCall($this->container->get('filesystem'), dirname($root_dir) . '/vendor/bundles/Sensio/Bundle/GeneratorBundle/Resources/skeleton/bundle');
        $output = $generator->execute($this->getRequest(), $root_dir, $kernel);

        return new Response(json_encode($output));
    }

    /**
     * Get a list of registered bundle in json format for fill combo
     * @return Response 
     */
    public function listAction() {
        $bundles = array();
        foreach ($this->container->get('kernel')->getBundles() as $bundle) {
            // get the bundle shortname ej: Acme/Bundle/Category/AcmeCategoryBlogBundle or AcmeBlogBundle ==>Blog
            $pieces = explode("\\", $bundle->getNamespace());
            $short = preg_replace('/Bundle$/', '', array_pop($pieces) );                     
            $bundles[] = array(
                'short' => $short,
                'name' => $bundle->getName()
                
            );
        }
       
        $total = count($bundles);
        return new Response(json_encode(array('data'=>$bundles,'total'=>$total)));
    }
    
    /**
     * Generate Entity
     * 
     * @return Response 
     */
    public function genEntityAction(){
        $request = $this->getRequest();
        $kernel = $this->container->get('kernel');
        
        $generator = new AxDoctrineEntityGeneratorCall($this->container->get('filesystem'), $this->container->get('doctrine'));
        $output = $generator->execute($request, $kernel);
        
        return new Response(json_encode($output)); 
    }
    
    /**
     * Generate/update entities 
     * 
     * @return Response 
     */
    public function genEntitiesAction()
    {
        $request = $this->getRequest();
        $kernel = $this->container->get('kernel');
        $doctrine = $this->container->get('doctrine');
        
        $generator = new AxDoctrineEntitiesGeneratorCall();
        $output = $generator->execute($request,$kernel,$doctrine);
        
        return new Response(json_encode($output)); 
    }
    
    /**
     * Generate CRUD
     * 
     * @return Response 
     */
    public function genCrudAction(){
        $request = $this->getRequest();
        $kernel = $this->container->get('kernel');
        $doctrine = $this->container->get('doctrine');
        $root_dir = dirname($this->container->getParameter('kernel.root_dir'));
           
        $generator = new AxDoctrineCrudGeneratorCall($this->container->get('filesystem'),  $root_dir . '/vendor/bundles/Sensio/Bundle/GeneratorBundle/Resources/skeleton');
        $output = $generator->execute($request,$kernel,$doctrine);
        
        return new Response(json_encode($output)); 
    }
    
}
